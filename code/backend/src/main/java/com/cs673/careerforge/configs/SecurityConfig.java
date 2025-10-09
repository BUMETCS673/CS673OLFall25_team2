package com.cs673.careerforge.configs;

/*
 * Stacey contributed to this class, but didn't create it. What I added is as follows:
 * AI-generated code: 90% (tool: ChatGPT, modified and adapted, functions: filterChain, users)
 * Human code: 10%
 */

import com.cs673.careerforge.common.auth.UserPrincipal;
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
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import com.cs673.careerforge.security.JwtAuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import java.util.List;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http,
                        JwtRequestFilter jwtRequestFilter,
                        JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) throws Exception {

                System.out.println(">>> Using custom SecurityConfig filterChain <<<");

                /*
                 * CSRF protection is safely disabled for this API because:
                 * 1. We use JWT tokens for authentication instead of cookies
                 * 2. The API is stateless (SessionCreationPolicy.STATELESS)
                 * 3. All state-changing operations require a valid JWT token
                 * 4. Authorization is handled via Bearer token, not session cookies
                 * 5. JWT tokens cannot be stolen via CSRF (no automatic browser inclusion)
                 * 
                 * This security model prevents CSRF attacks by design:
                 * - No session cookies to steal
                 * - JWTs must be explicitly included in Authorization header
                 * - Attacker cannot forge valid JWTs without the secret key
                 */
                return http
                                .csrf(AbstractHttpConfigurer::disable) // Safe because we use JWT tokens
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
