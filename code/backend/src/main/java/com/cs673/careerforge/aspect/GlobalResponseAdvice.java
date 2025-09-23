package com.cs673.careerforge.aspect;

import com.cs673.careerforge.common.BaseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.Set;

/**
 * Wrap all successful controller returns in BaseResult(success=true),
 * but skip wrapping for excluded paths.
 */
@RestControllerAdvice
public class GlobalResponseAdvice implements ResponseBodyAdvice<Object> {

    private static final String EX_FLAG = "EX_FROM_HANDLER";
    private static final Set<String> EXCLUDED_PATHS = Set.of("/", "/public/ping");

    @Autowired(required = false)
    private ObjectMapper objectMapper;

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {

        // Skip wrapping for excluded paths
        if (isExcluded(request)) {
            return body;
        }

        // If an exception has already been mapped to a response, do not wrap again
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null && Boolean.TRUE.equals(attrs.getRequest().getAttribute(EX_FLAG))) {
            return body;
        }

        // Preserve status and headers for ResponseEntity
        if (body instanceof ResponseEntity) {
            ResponseEntity<?> entity = (ResponseEntity<?>) body;
            Object inner = entity.getBody();
            return ResponseEntity.status(entity.getStatusCode())
                    .headers(entity.getHeaders())
                    .body(BaseResult.ok(inner));
        }

        // If controller returned BaseResult (either success or handled failure),
        // treat it as handled inner result and wrap as outer success=true
        if (body instanceof BaseResult) {
            return BaseResult.ok(body);
        }

        // Handle String return type
        if (String.class.equals(returnType.getParameterType())) {
            try {
                if (objectMapper == null) objectMapper = new ObjectMapper();
                return objectMapper.writeValueAsString(BaseResult.ok(body));
            } catch (Exception e) {
                return body; // fallback to raw string
            }
        }

        // Default wrapping
        return BaseResult.ok(body);
    }

    private boolean isExcluded(ServerHttpRequest request) {
        if (request == null || request.getURI() == null) return false;
        String path = request.getURI().getPath();
        if (path == null) return false;
        if ("/".equals(path)) return true;
        if (path.endsWith("/") && path.length() > 1) {
            path = path.substring(0, path.length() - 1);
        }
        return EXCLUDED_PATHS.contains(path);
    }
}