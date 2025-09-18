package com.cs673.careerforge.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import com.cs673.careerforge.security.JwtRequestFilter;
import com.cs673.careerforge.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtRequestFilter jwtRequestFilter) throws Exception {
        //csrf.disable -> typical for stateless APIs
        return http
                .csrf(csrf -> csrf.disable())
                // allow H2 console to render in a frame
                .headers(h -> h.frameOptions(f -> f.sameOrigin()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                //For testing uncomment out the first line below
                                //"/",
                                "/actuator/health",
                                "/h2-console/**",
                                "/public/**",
                                "authenticate", // change for login endpoint
                                "/register"        // change for signup endpoint
                        ).permitAll()
                        .requestMatchers("/secure").authenticated() // secure endpoint requires JWT
                        .anyRequest().permitAll()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // no HTTP sessions
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

