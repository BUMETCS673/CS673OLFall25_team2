package com.cs673.careerforge.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import java.security.Key;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private UserDetails testUser;
    private String secret;

    @BeforeEach
    void setUp() {
        secret = "MzJieXRlc19zdXBlcl9zZWN1cmVfamV0X3Rlc3Rfc2VjcmV0X2tleQ==";
        jwtUtil = new JwtUtil(secret, 3600000L); // 1h expiration
        testUser = User.withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void generateAndValidateToken_valid() {
        String token = jwtUtil.generateToken(testUser);
        assertTrue(jwtUtil.validateToken(token, testUser));
        assertEquals("testuser", jwtUtil.extractUsername(token));
    }

    @Test
    void validateToken_invalid() {
        String token = jwtUtil.generateToken(testUser);

        // Create a different user to compare against
        UserDetails otherUser = User.withUsername("otheruser")
                .password("password")
                .roles("USER")
                .build();

        assertFalse(jwtUtil.validateToken(token, otherUser));
    }


    @Test
    void validateToken_expired() {
        Key signingKey = jwtUtil.getSigningKeyForTests();

        String expiredToken = Jwts.builder()
                .setSubject(testUser.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis() - 20000)) // 20s ago
                .setExpiration(new Date(System.currentTimeMillis() - 10000)) // expired 10s ago
                .signWith(signingKey, SignatureAlgorithm.HS256) // ✅ exact same key
                .compact();

        assertFalse(jwtUtil.validateToken(expiredToken, testUser));
    }
}
