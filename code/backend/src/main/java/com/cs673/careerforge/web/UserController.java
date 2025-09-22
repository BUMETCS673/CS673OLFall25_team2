package com.cs673.careerforge.web;

import com.cs673.careerforge.entity.User;
import com.cs673.careerforge.exception.ConflictException;
import com.cs673.careerforge.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/public/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user.
     * Returns:
     *  - 201 Created with user response body
     *  - 409 Conflict with list of conflicting fields if username/email already exist
     *  - 400 Bad Request with structured field errors (handled by RestExceptionHandler)
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Uniqueness guard for 409
        List<String> conflicts = new ArrayList<>();
        if (userService.existsByUsername(request.username())) {
            conflicts.add("username");
        }
        if (userService.existsByEmail(request.email())) {
            conflicts.add("email");
        }
        if (!conflicts.isEmpty()) {
            throw new ConflictException("Unique constraint violation", conflicts);
        }

        // Map DTO -> Entity (only fields the client is allowed to set)
        User toCreate = new User();
        toCreate.setUsername(request.username());
        toCreate.setEmail(request.email());
        toCreate.setFirstName(request.firstName());
        toCreate.setLastName(request.lastName());
        toCreate.setPassword(request.password()); // assume service encodes

        User created = userService.createUser(toCreate);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).body(UserResponse.from(created));
    }

    // ---------- DTOs ----------

    public record RegisterRequest(
            @NotBlank(message = "username is required")
            @Size(min = 3, max = 50, message = "username must be between 3 and 50 characters")
            String username,

            @NotBlank(message = "email is required")
            @Email(message = "email must be a valid email address")
            String email,

            @NotBlank(message = "password is required")
            @Size(min = 8, max = 100, message = "password must be between 8 and 100 characters")
            String password,

            @NotBlank(message = "firstName is required")
            @Size(max = 100, message = "firstName must be at most 100 characters")
            String firstName,

            @NotBlank(message = "lastName is required")
            @Size(max = 100, message = "lastName must be at most 100 characters")
            String lastName
    ) {}

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
