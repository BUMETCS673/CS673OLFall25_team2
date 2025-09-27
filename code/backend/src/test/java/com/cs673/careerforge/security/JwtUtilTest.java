package com.cs673.careerforge.security;


/*
 AI-generated code: 90% (tool: ChatGPT, modified and adapted)
 Human code: 10%
*/

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**@SpringBootTest loads the real Spring bean for JwtUtil.
* @DynamicPropertySource dynamically generates a valid Base64 secret for tests.
* No need to hardcode anything in application-test.properties.
* Each test run gets a fresh secret (isolated, no flakiness)
* */

@SpringBootTest(classes = JwtUtil.class)
@ActiveProfiles("test")
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Dynamically provide a valid Base64 JWT secret + expiration
     * before the Spring context loads.
     */
    @DynamicPropertySource
    static void jwtProperties(DynamicPropertyRegistry registry) {
        String secret = Base64.getEncoder().encodeToString(
                Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()
        );
        registry.add("app.jwt.secret", () -> secret);
        registry.add("app.jwt.expiration", () -> 3600000L); // 1 hour
    }

    @Test
    void generateAndValidateToken_valid() {
        UserDetails testUser = User.withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();

        String token = jwtUtil.generateToken(testUser);

        assertTrue(jwtUtil.validateToken(token, testUser));
        assertEquals("testuser", jwtUtil.extractUsername(token));
    }

    @Test
    void validateToken_invalidUser() {
        UserDetails testUser = User.withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();

        String token = jwtUtil.generateToken(testUser);

        UserDetails otherUser = User.withUsername("otheruser")
                .password("password")
                .roles("USER")
                .build();

        assertFalse(jwtUtil.validateToken(token, otherUser));
    }

    @Test
    void validateToken_expired() {
        UserDetails testUser = User.withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();

        Key signingKey = jwtUtil.getSigningKeyForTests();

        String expiredToken = Jwts.builder()
                .setSubject(testUser.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis() - 20000)) // issued 20s ago
                .setExpiration(new Date(System.currentTimeMillis() - 10000)) // expired 10s ago
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();

        assertFalse(jwtUtil.validateToken(expiredToken, testUser));
    }

    @Test
    void validateToken_tamperedTokenShouldFail(){
        UserDetails testUser = User.withUsername("testUser")
                .password("password")
                .roles("USER")
                .build();

        //generate a valid token
        String token = jwtUtil.generateToken(testUser);

        //tamper with the token
        String tamperedToken = token + "111";

        //assert that the validation will fail
        assertFalse(jwtUtil.validateToken(tamperedToken, testUser),
            "The token has been tampered with! FAIL");
        }

    @Test
    void validateToken_wrongSignature() {
        UserDetails testUser = User.withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();

        // Build token with a different signing key than jwtUtil uses
        Key otherKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        String token = Jwts.builder()
                .setSubject(testUser.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(otherKey, SignatureAlgorithm.HS256)
                .compact();

        assertFalse(jwtUtil.validateToken(token, testUser));
    }

    @Test
    void validateToken_nullOrEmpty() {
        UserDetails testUser = User.withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();

        assertFalse(jwtUtil.validateToken(null, testUser));
        assertFalse(jwtUtil.validateToken("", testUser));
    }
}
