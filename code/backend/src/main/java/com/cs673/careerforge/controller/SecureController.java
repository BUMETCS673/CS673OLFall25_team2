package com.cs673.careerforge.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;


@RestController
public class SecureController {

    @GetMapping("/secure")
    public String secureEndpoint(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return "Hello Admin: " + authentication.getName();
        } else {
            return "Hello User: " + authentication.getName();
        }
    }

    @GetMapping("/public/hello")
    public String publicHello() {
        return "👋 Anyone can see this!";
    }
}
