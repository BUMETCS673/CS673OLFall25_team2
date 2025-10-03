package com.cs673.careerforge.security;

/*
 Human code: 100%
*/

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SignatureJwtErrorHandler implements JwtErrorHandler {
    private static final Logger logger = LoggerFactory.getLogger(SignatureJwtErrorHandler.class);

    @Override
    public void handle(Exception e) {
        logger.warn("JWT token signature invalid: {}", e.getMessage());
    }
}
