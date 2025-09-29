package com.cs673.careerforge.web.controller;


/*
 AI-generated code: 100% (tool: ChatGPT, modified and adapted)
*/

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Admin dashboard works!";
    }
}
