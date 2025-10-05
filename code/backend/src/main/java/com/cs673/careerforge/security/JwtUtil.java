package com.cs673.careerforge.security;

/*
 AI-generated code: 90% (tool: CHatGPT, modified and adapted)
 Human code: 20% (Updated validateToken())
*/

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.function.Function;
import java.util.Base64;
import java.security.Key;
import java.util.Date;
import com.cs673.careerforge.security.JwtErrorHandlerFactory;

/**This class will check if we are on prod or dev,
* if dev it will auto generate a key and persist it,
* if prod and missing will fail,
* generate JWT tokens, validate tokens, extract username,claims*/

@Component
public class JwtUtil {
    private SecretKey secretKey;
    private final long jwtExpiration;
    private final Environment env;
    private String base64Secret;

    // File to persist the dev secret
    private static final Path LOCAL_SECRET_FILE =
            Paths.get(System.getProperty("user.home"), ".jwt-secret");

    public JwtUtil(
            @Value("${app.jwt.expiration:86400000}") long jwtExpiration,
            Environment env,
            @Value("${app.jwt.secret:}") String secret // may be blank if not set
    ) {
        this.jwtExpiration = jwtExpiration;
        this.env = env;
        this.base64Secret = secret;
    }

    @PostConstruct
    private void init() {
        try {
            this.base64Secret = resolveSecret();
            System.out.println("Loaded JWT secret (length): " + base64Secret.length());
            this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize JwtUtil", e);
        }
    }

/*Use app.jwt.secret if set (from env)
If prod profile → fail fast
If dev profile → look for existing application-dev.properties
If missing → generate a key, append/persist it into application-dev.properties
 */

    private String resolveSecret() throws IOException {
        // 1. Check ENV var
        String envSecret = System.getenv("APP_JWT_SECRET");
        if (envSecret != null && !envSecret.isBlank()) {
            return envSecret;
        }

        // 2. Check application.properties (injected via @Value)
        if (base64Secret != null && !base64Secret.isBlank()) {
            try {
                Decoders.BASE64.decode(base64Secret); // validate
                return base64Secret;
            } catch (Exception e) {
                throw new IllegalStateException("Invalid Base64 secret configured", e);
            }
        }

        // 3. Decide based on profile
        List<String> profiles = Arrays.asList(env.getActiveProfiles());

        if (profiles.contains("prod")) {
            // In production, no secret found → fail fast
            throw new IllegalStateException(
                    "JWT secret must be provided in production via APP_JWT_SECRET or app.jwt.secret"
            );
        }

        // 4. In dev → reuse local persisted secret if it exists
        if (Files.exists(LOCAL_SECRET_FILE)) {
            return Files.readString(LOCAL_SECRET_FILE).trim();
        }

        // 5. In dev → generate a new one and persist
        String generated = Base64.getEncoder().encodeToString(
                Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()
        );

        Files.writeString(
                LOCAL_SECRET_FILE,
                generated,
                StandardOpenOption.CREATE_NEW
        );

        System.out.println("Generated new dev JWT secret and saved to " + LOCAL_SECRET_FILE);
        return generated;
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
            JwtErrorHandlerFactory.getHandler(e).handle(e);
            return false;
        }
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Key getSigningKey() {
        return this.secretKey;
    }

    // For testing purposes only
    Key getSigningKeyForTests() {
        return getSigningKey(); // delegates to your private method
    }
}