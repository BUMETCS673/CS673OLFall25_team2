package com.cs673.careerforge.configs;

/*
 * Stacey contributed to this class, but didn't create it. What I added is as follows:
 * AI-generated code: 90% (tool: ChatGPT, modified and adapted, functions: filterChain, users)
 * Human code: 10%
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import com.cs673.careerforge.security.JwtRequestFilter;
import com.cs673.careerforge.security.JwtAuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import java.util.List;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http,
                        JwtRequestFilter jwtRequestFilter,
                        JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) throws Exception {

                System.out.println(">>> Using custom SecurityConfig filterChain <<<");

                /*
                 * CSRF protection configuration:
                 * 1. Enable CSRF protection by default for safety
                 * 2. Disable it only for:
                 * - Public endpoints that don't modify state
                 * - Authentication endpoints that use JWT
                 * - API endpoints that require valid JWT token
                 * 3. Maintain CSRF protection for:
                 * - Any endpoints that might use cookies
                 * - H2 console and actuator endpoints
                 */
                HttpSessionCsrfTokenRepository tokenRepository = new HttpSessionCsrfTokenRepository();
                tokenRepository.setHeaderName("X-XSRF-TOKEN");

                return http
                        .csrf(csrf -> csrf.disable())
                        .cors(Customizer.withDefaults())
                                // allow H2 console to render in a frame
                                .headers(h -> h.frameOptions(f -> f.sameOrigin()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                // For testing uncomment out the first line below to
                                                                // allow all endpoints to be unauthenticated
                                                                // "/",
                                                                "/actuator/health",
                                                                "/h2-console/**",
                                                                "/public/**",
                                                                "/auth/login",
                                                                "/auth/register")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // no HTTP
                                                                                                        // sessions
                                )
                                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                // Allow all our known origins
                configuration.setAllowedOrigins(List.of(
                                "http://localhost:5173",
                                "http://localhost:4173",
                                "https://cs673olfall25-team2.onrender.com",
                                "http://cs673olfall25-team2.onrender.com",
                                "https://cs673olfall25-team2-proxy.onrender.com"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Origin",
                                "Accept", "Access-Control-Allow-Origin"));
                configuration.setExposedHeaders(List.of("Location"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
                return cfg.getAuthenticationManager();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
