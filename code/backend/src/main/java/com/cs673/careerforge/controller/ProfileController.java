package com.cs673.careerforge.model;

/*
 AI-generated code: 80% (tool: ChatGPT, modified and adapted)
 Human code: 20%
 This is strictly to test a secure endpoint with a JWT token
*/

// Spring Web
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Spring Security
import org.springframework.security.core.Authentication;

// Your domain + response classes
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.web.UserController;


@RestController
@RequestMapping("/users")
public class ProfileController {
    @GetMapping("/me")
    public ResponseEntity<UserController.UserResponse> me(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(UserController.UserResponse.from(user));
    }
}
