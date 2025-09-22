// src/main/java/com/cs673/careerforge/configs/SecurityBeansConfig.java
package com.cs673.careerforge.configs;

import com.cs673.careerforge.entity.User;
import com.cs673.careerforge.entity.UserType;
import com.cs673.careerforge.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class SecurityBeansConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean  // use DB users for authentication
    public UserDetailsService userDetailsService(UserRepository repo) {
        return username -> {
            User u = repo.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            String role = (u.getUserType() == UserType.EMPLOYER) ? "ROLE_EMPLOYER" : "ROLE_EMPLOYEE";
            boolean enabled = Boolean.TRUE.equals(u.getIsActive());
            return new org.springframework.security.core.userdetails.User(
                    u.getUsername(),
                    u.getPassword(), // already BCrypt-encoded at registration
                    enabled, true, true, true,
                    List.of(new SimpleGrantedAuthority(role), new SimpleGrantedAuthority("ROLE_USER"))
            );
        };
    }
}
