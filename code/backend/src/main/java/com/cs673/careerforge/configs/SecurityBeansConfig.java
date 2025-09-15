package com.cs673.careerforge.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityBeansConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService users(
            @Value("${spring.security.user.name}") String username,
            @Value("${spring.security.user.password}") String password,
            @Value("${spring.security.user.roles:ADMIN}") String rolesCsv) {

        String[] roles = rolesCsv.split("\\s*,\\s*");
        UserDetails user = User.withUsername(username)
                .password(passwordEncoder().encode(password))
                .roles(roles)
                .build();

        return new InMemoryUserDetailsManager(user);
    }
}
