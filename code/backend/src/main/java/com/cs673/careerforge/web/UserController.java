package com.cs673.careerforge.web;

import com.cs673.careerforge.entity.User;
import com.cs673.careerforge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

/**
 * Public endpoints for user registration.
 * Uses existing User entity validation and UserService#createUser for persistence + password encoding.
 */
@RestController
@RequestMapping("/public/users")
@Validated
public class UserController {

    private final UserService userService;

    // Constructor injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user.
     * Accepts a JSON body matching the existing User entity's validation constraints
     * (username, email, password, firstName, lastName, userType, etc.).
     *
     * Returns 201 Created with a Location header pointing to /public/users/{id}
     * and a sanitized payload that does NOT include the password.
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody User requestBody) {
        // Delegate to existing service which performs:
        // - validation
        // - duplicate username/email checks
        // - password encoding
        User created = userService.createUser(requestBody);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).body(UserResponse.from(created));
    }

    /**
     * Minimal response DTO to avoid leaking sensitive fields (like password).
     * Keeps it close to your existing entity so we reuse as much as possible without exposing secrets.
     */
    public static final class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String userType;
        private Boolean isActive;

        public static UserResponse from(User u) {
            UserResponse r = new UserResponse();
            r.id = u.getId();
            r.username = u.getUsername();
            r.email = u.getEmail();
            r.firstName = u.getFirstName();
            r.lastName = u.getLastName();
            r.userType = (u.getUserType() != null ? u.getUserType().name() : null);
            r.isActive = u.getIsActive();
            return r;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getUserType() { return userType; }
        public Boolean getIsActive() { return isActive; }
    }
}
