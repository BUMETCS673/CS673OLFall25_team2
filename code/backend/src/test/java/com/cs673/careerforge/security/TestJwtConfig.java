package com.cs673.careerforge.security;

/*
 AI-generated code: 90% (tool: ChatGPT)
 Human code: 10%
*/

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Encoders;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@TestConfiguration
public class TestJwtConfig {

    @DynamicPropertySource
    static void jwtProperties(DynamicPropertyRegistry registry) {
        // Generate a proper Base64-encoded HS256 key
        String base64Key = Encoders.BASE64.encode(
                Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()
        );

        registry.add("app.jwt.secret", () -> base64Key);
        registry.add("app.jwt.expiration", () -> 3600000L); // 1 hour
    }
}
