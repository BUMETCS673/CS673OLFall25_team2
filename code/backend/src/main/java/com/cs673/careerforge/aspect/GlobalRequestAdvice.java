package com.cs673.careerforge.aspect;

import jakarta.servlet.http.HttpServletRequest; // Spring Boot 3.x; for 2.x use javax.servlet.http.HttpServletRequest
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.annotation.Annotation;
import java.lang.reflect.*;
import java.util.*;

/**
 * Written by human.
 */
@Aspect
@Component
public class GlobalRequestAdvice {

    private static final List<String> TARGET_FIELD_NAMES = Arrays.asList(
            "clientIp", "userAgent", "requestId", "httpMethod", "requestUri", "headers"
    );

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object wrap(ProceedingJoinPoint pjp) throws Throwable {
        MethodSignature sig = (MethodSignature) pjp.getSignature();
        Method method = sig.getMethod();
        Annotation[][] paramAnns = method.getParameterAnnotations();
        Class<?>[] paramTypes = method.getParameterTypes();

        int bodyIdx = -1;
        int reqIdx = -1;

        // Find @RequestBody parameter index and HttpServletRequest index
        for (int i = 0; i < paramTypes.length; i++) {
            if (hasRequestBodyAnnotation(paramAnns[i])) {
                bodyIdx = i;
            }
            if (HttpServletRequest.class.isAssignableFrom(paramTypes[i])) {
                reqIdx = i;
            }
        }
        if (bodyIdx == -1 || reqIdx == -1) {
            return pjp.proceed(); // Not our target signature
        }

        Object[] args = pjp.getArgs();
        Object body = args[bodyIdx];
        HttpServletRequest request = (HttpServletRequest) args[reqIdx];

        // If body is null and we can create one, instantiate it
        if (body == null) {
            Class<?> bodyType = paramTypes[bodyIdx];
            try {
                Constructor<?> ctor = bodyType.getDeclaredConstructor();
                ctor.setAccessible(true);
                body = ctor.newInstance();
                args[bodyIdx] = body;
            } catch (Exception ignored) {
                // If cannot instantiate, skip enhancement and proceed
                return pjp.proceed(args);
            }
        }

        // Build request info to inject
        Map<String, String> headers = extractHeaders(request);
        String clientIp = resolveClientIp(request);
        String userAgent = headers.getOrDefault("User-Agent", null);
        String requestId = firstNonNull(
                headers.get("X-Request-Id"),
                headers.get("X-Request-ID"),
                headers.get("traceparent")  // W3C trace context
        );
        String httpMethod = request.getMethod();
        String requestUri = request.getRequestURI();

        // Inject into @RequestBody object if fields/setters exist
        setIfPresent(body, "clientIp", clientIp);
        setIfPresent(body, "userAgent", userAgent);
        setIfPresent(body, "requestId", requestId);
        setIfPresent(body, "httpMethod", httpMethod);
        setIfPresent(body, "requestUri", requestUri);
        setIfPresent(body, "headers", headers);

        // (Optional) also bind query parameters to same-named String fields if empty
        bindQueryParams(body, request);

        return pjp.proceed(args);
    }

    private boolean hasRequestBodyAnnotation(Annotation[] anns) {
        for (Annotation a : anns) {
            if (a.annotationType().getName().equals(
                    "org.springframework.web.bind.annotation.RequestBody")) {
                return true;
            }
        }
        return false;
    }

    private Map<String, String> extractHeaders(HttpServletRequest req) {
        Map<String, String> map = new LinkedHashMap<>();
        Enumeration<String> names = req.getHeaderNames();
        if (names != null) {
            while (names.hasMoreElements()) {
                String n = names.nextElement();
                map.put(n, req.getHeader(n));
            }
        }
        return map;
    }

    private String resolveClientIp(HttpServletRequest req) {
        String ip = headerFirst(req, "X-Forwarded-For");
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        if (isEmpty(ip)) ip = headerFirst(req, "X-Real-IP");
        if (isEmpty(ip)) ip = req.getRemoteAddr();
        return ip;
    }

    private String headerFirst(HttpServletRequest req, String name) {
        String v = req.getHeader(name);
        return isEmpty(v) ? null : v.trim();
    }

    private String firstNonNull(String... vals) {
        for (String v : vals) if (v != null && !v.isEmpty()) return v;
        return null;
    }

    private boolean isEmpty(String s) {
        return s == null || s.isEmpty();
    }

    private void setIfPresent(Object target, String name, Object value) {
        if (value == null) return;

        Class<?> cls = target.getClass();
        // Try setter
        String setter = "set" + Character.toUpperCase(name.charAt(0)) + name.substring(1);
        for (Method m : cls.getMethods()) {
            if (m.getName().equals(setter) && m.getParameterCount() == 1) {
                Class<?> t = m.getParameterTypes()[0];
                if (isAssignable(value.getClass(), t)) {
                    try {
                        m.invoke(target, value);
                        return;
                    } catch (Exception ignored) {}
                }
                // Try simple String conversion
                if (value instanceof String && t == String.class) {
                    try { m.invoke(target, value); return; } catch (Exception ignored) {}
                }
            }
        }
        // Try direct field
        try {
            Field f = findField(cls, name);
            if (f != null) {
                f.setAccessible(true);
                if (isAssignable(value.getClass(), f.getType())) {
                    f.set(target, value);
                }
            }
        } catch (Exception ignored) {}
    }

    private Field findField(Class<?> cls, String name) {
        Class<?> c = cls;
        while (c != null && c != Object.class) {
            try { return c.getDeclaredField(name); }
            catch (NoSuchFieldException ignored) { c = c.getSuperclass(); }
        }
        return null;
    }

    private boolean isAssignable(Class<?> src, Class<?> dst) {
        if (dst.isAssignableFrom(src)) return true;
        // Simple bridge for Map injection (headers)
        if (Map.class.isAssignableFrom(dst) && Map.class.isAssignableFrom(src)) return true;
        return false;
    }

    private void bindQueryParams(Object body, HttpServletRequest req) {
        Map<String, String[]> params = req.getParameterMap();
        if (params == null || params.isEmpty()) return;

        Class<?> cls = body.getClass();
        for (Map.Entry<String, String[]> e : params.entrySet()) {
            String name = e.getKey();
            String val = (e.getValue() != null && e.getValue().length > 0) ? e.getValue()[0] : null;
            if (val == null) continue;

            // Only bind into String fields/setters and only if the current value is null/empty
            String current = getCurrentStringValue(body, name);
            if (current == null || current.isEmpty()) {
                setIfPresent(body, name, val);
            }
        }
    }

    private String getCurrentStringValue(Object target, String name) {
        Class<?> cls = target.getClass();
        String getter = "get" + Character.toUpperCase(name.charAt(0)) + name.substring(1);
        try {
            Method m = cls.getMethod(getter);
            Object v = m.invoke(target);
            return (v instanceof String) ? (String) v : null;
        } catch (Exception ignored) {}

        Field f = findField(cls, name);
        if (f != null) {
            try {
                f.setAccessible(true);
                Object v = f.get(target);
                return (v instanceof String) ? (String) v : null;
            } catch (Exception ignored) {}
        }
        return null;
    }
}