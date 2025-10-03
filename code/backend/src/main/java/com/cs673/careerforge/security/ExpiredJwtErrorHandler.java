package com.cs673.careerforge.security;

/*
 Human code: 100%
*/

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExpiredJwtErrorHandler implements JwtErrorHandler {
    private static final Logger logger = LoggerFactory.getLogger(ExpiredJwtErrorHandler.class);

    @Override
    public void handle(Exception e) {
        logger.info("JWT token expired: {}", e.getMessage());
    }
}
