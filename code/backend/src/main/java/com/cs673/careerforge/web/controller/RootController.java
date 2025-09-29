package com.cs673.careerforge.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    // With server.servlet.context-path=/api this maps to GET /api/
    @GetMapping("/")
    public String home() {
        return "CareerForge API is up ✅";
    }

    // No-auth test endpoint (your SecurityConfig permits /public/**)
    @GetMapping("/public/ping")
    public String ping() {
        return "pong";
    }
}
