package com.cs673.careerforge.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecureController {

    @GetMapping("/secure")
    public String secureEndpoint() {
        return "This is a SECURED endpoint. You must be authenticated to see this.";
    }

    @GetMapping("/public/hello")
    public String publicHello() {
        return "👋 Anyone can see this!";
    }
}
