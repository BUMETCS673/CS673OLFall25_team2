package com.cs673.careerforge.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Set;

/**
 * Logs URI, HTTP method, args, return, and elapsed time for all @RestController methods,
 * except excluded URIs.
 * Written by human.
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Set<String> EXCLUDED_URIS = Set.of("/", "/public/ping");
    private final ObjectMapper om = new ObjectMapper();

    @Around("@within(restController)")
    public Object around(ProceedingJoinPoint pjp, RestController restController) throws Throwable {
        long start = System.currentTimeMillis();

        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest req = attrs != null ? attrs.getRequest() : null;

        String uri = req != null ? req.getRequestURI() : "";
        String httpMethod = req != null ? req.getMethod() : "";
        String methodSig = ((MethodSignature) pjp.getSignature()).toShortString();

        // Skip logging for excluded URIs
        if (isExcluded(uri)) {
            return pjp.proceed();
        }

        String argsJson;
        try {
            argsJson = om.writeValueAsString(pjp.getArgs());
        } catch (Exception e) {
            argsJson = "[unserializable args]";
        }

        try {
            Object ret = pjp.proceed();
            String retJson;
            try {
                retJson = om.writeValueAsString(ret);
            } catch (Exception e) {
                retJson = "[unserializable return]";
            }

            long costMs = System.currentTimeMillis() - start;
            System.out.printf("[REQ] %s %s %s args=%s | [RESP] %s | %dms%n",
                    httpMethod, uri, methodSig, argsJson, retJson, costMs);
            return ret;
        } catch (Throwable ex) {
            long costMs = System.currentTimeMillis() - start;
            System.out.printf("[REQ] %s %s %s args=%s | [EX] %s | %dms%n",
                    httpMethod, uri, methodSig, argsJson, ex.toString(), costMs);
            throw ex;
        }
    }

    /**
     * Exact-match exclusion with normalization for trailing slash (except root "/").
     */
    private boolean isExcluded(String uri) {
        if (uri == null || uri.isEmpty()) return false;
        if ("/".equals(uri)) return true;
        // Normalize trailing slash (e.g., "/public/ping/")
        if (uri.endsWith("/") && uri.length() > 1) {
            uri = uri.substring(0, uri.length() - 1);
        }
        return EXCLUDED_URIS.contains(uri);
    }
}