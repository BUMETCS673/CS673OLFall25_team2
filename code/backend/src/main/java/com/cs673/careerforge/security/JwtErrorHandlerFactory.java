package com.cs673.careerforge.security;

/*
 Human code: 100%
*/

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;

import java.util.Map;
import java.util.function.Function;

public class JwtErrorHandlerFactory {

    private static final Map<Class<? extends Exception>, JwtErrorHandler> handlers = Map.of(
            ExpiredJwtException.class, new ExpiredJwtErrorHandler(),
            SignatureException.class, new SignatureJwtErrorHandler()
    );

    public static JwtErrorHandler getHandler(Exception e) {
        return handlers.getOrDefault(e.getClass(),
                ex -> {
                    org.slf4j.LoggerFactory.getLogger(JwtErrorHandlerFactory.class)
                            .error("Unexpected JWT error", ex);
                });
    }
}
