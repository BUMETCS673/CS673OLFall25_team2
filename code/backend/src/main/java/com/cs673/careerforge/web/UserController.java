package com.cs673.careerforge.web;
/*
 AI-generated code:   100% (tool: ChatGPT)
 Human code: 0%
 Framework-generated code: 0%
*/

import com.cs673.careerforge.common.UserType;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.exceptions.ConflictException;
import com.cs673.careerforge.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.cs673.careerforge.security.JwtUtil;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService,
                          UserDetailsService userDetailsService,
                          JwtUtil jwtUtil) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new user.
     * Returns:
     *  - 201 Created with user response body
     *  - 409 Conflict with list of conflicting fields if username/email already exist
     *  - 400 Bad Request with structured field errors (handled by RestExceptionHandler)
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Uniqueness guard for 409
        if (userService.existsByEmail(request.email())) {
            throw new ConflictException("Email already exists: " + request.email(), List.of("email"));
        }

        // --- Handle name ---
        String[] parts = request.name().trim().split(" ", 2);

        String firstName = parts.length > 0
                ? parts[0].replaceAll("[^a-zA-Z\\s]", "")
                : "Unknown";
        if (firstName.isBlank()) firstName = "Unknown";

        String lastName = parts.length > 1
                ? parts[1].replaceAll("[^a-zA-Z\\s]", "")
                : "Unknown";
        if (lastName.isBlank()) lastName = "Unknown";

        // --- Auto-generate username ---
        // use prefix of email, sanitize to letters/numbers/underscores
        String username = request.email().split("@")[0]
                .replaceAll("[^a-zA-Z0-9_]", "_");

        if (username.isBlank()) {
            username = "user_" + System.currentTimeMillis(); // fallback
        }

        // --- Map DTO -> Entity ---
        User toCreate = new User();
        toCreate.setUsername(username);
        toCreate.setEmail(request.email());
        toCreate.setFirstName(firstName);
        toCreate.setLastName(lastName);
        toCreate.setUserType(UserType.EMPLOYEE); // default role
        toCreate.setPassword(request.password()); // encoded in service

        User created = userService.createUser(toCreate);

        // --- Build JWT ---
        var userDetails = userDetailsService.loadUserByUsername(created.getEmail());
        String jwt = jwtUtil.generateToken(userDetails);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        UserResponse userResponse = UserResponse.from(created);
        RegisterResponse response = new RegisterResponse(jwt, userResponse);

        return ResponseEntity.created(location).body(response);
    }

    // ---------- DTOs ----------


    public record RegisterRequest(

            @NotBlank(message = "name is required")
            @Size(min = 3, max = 100, message = "name must be between 3 and 100 characters")
            String name,

            @NotBlank(message = "email is required")
            @Email(message = "email must be a valid email address")
            String email,

            @NotBlank(message = "password is required")
            @Size(min = 8, max = 100, message = "password must be between 8 and 100 characters")
            String password
    ) {}

    public record RegisterResponse(String token, UserResponse user) {}

    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String userType;   // if you use enums, expose as String
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
