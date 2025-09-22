// src/main/java/com/cs673/careerforge/web/AuthController.java
package com.cs673.careerforge.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserDetailsService users;

    public AuthController(AuthenticationManager authManager, UserDetailsService users) {
        this.authManager = authManager;
        this.users = users;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));
            UserDetails user = users.loadUserByUsername(req.username());

            // TODAY: return a simple OK + user info
            // LATER (with JWT): generate token and return it here.
            return ResponseEntity.ok(Map.of(
                    "status", "OK",
                    "username", user.getUsername(),
                    "roles", user.getAuthorities().stream().map(a -> a.getAuthority()).toArray()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "UNAUTHORIZED", "message", "Invalid username or password"));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("status", "FORBIDDEN", "message", "User is disabled"));
        }
    }

    public record LoginRequest(String username, String password) {}
}