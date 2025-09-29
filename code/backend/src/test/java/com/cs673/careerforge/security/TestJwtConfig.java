package com.cs673.careerforge.security;

/*
 AI-generated code: 90% (tool: ChatGPT)
 Human code: 10%
*/

import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.SecretKey;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

@TestConfiguration
public class TestJwtConfig {

    @Bean
    @Primary
    public JwtUtil jwtUtil(Environment env) {
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        String base64Key = Encoders.BASE64.encode(key.getEncoded());

        long expiration = 3600000L; // 1 hour (or read from test properties if you prefer)

        return new JwtUtil(expiration, env, base64Key);
    }
}
