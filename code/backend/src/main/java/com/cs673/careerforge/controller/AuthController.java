package com.cs673.careerforge.model;

/*
 AI-generated code: 90% (tool: ChatGPT, modified and adapted)
 Human code: 10%
*/
import com.cs673.careerforge.model.AuthRequest;
import com.cs673.careerforge.security.JwtUtil;
import com.cs673.careerforge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import com.cs673.careerforge.domain.User;


import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserService userService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserDetailsService userDetailsService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        if (authRequest.getEmail() == null || authRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "Email and password are required"
            ));
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(), authRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body(Map.of(
                    "status", 401,
                    "error", "Unauthorized",
                    "message", "Invalid email or password"
            ));
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        User userEntity = userService.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "id", "USER_" + userEntity.getId(),
                        "name", userEntity.getFirstName() + " " + userEntity.getLastName(),
                        "email", userEntity.getEmail()
                )
        ));
    }
}
