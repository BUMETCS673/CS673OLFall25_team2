package com.cs673.careerforge.configs;

/*
 Stacey contributed to this class, but didn't create it. What I added is as follows:
 AI-generated code: 90% (tool: ChatGPT, modified and adapted, functions: filterChain, users)
 Human code: 10%
*/


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

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtRequestFilter jwtRequestFilter,
                                           JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) throws Exception {
        //csrf.disable -> typical for stateless APIs
        return http
                .csrf(csrf -> csrf.disable())
                // allow H2 console to render in a frame
                .headers(h -> h.frameOptions(f -> f.sameOrigin()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                //For testing uncomment out the first line below to allow all endpoints to be unauthenticated
                                //"/",
                                "/actuator/health",
                                "/h2-console/**",
                                "/public/**",
                                "/authenticate", // change for login endpoint
                                "/register"        // change for signup endpoint
                        ).permitAll()
                        .requestMatchers("/secure").authenticated() // secure endpoint requires JWT
                     //   .requestMatchers("/secure").hasRole("USER") // secure endpoint requires JWT, both USER and ADMIN get in
                        .requestMatchers("/admin/**").hasRole("ADMIN") //only ADMIN. Not implemented yet. Just being used for tests
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // no HTTP sessions
                )
                // plug in the custom entrypoint
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(jwtAuthenticationEntryPoint)
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
            @Value("${app.security.user.name}") String userName,
            @Value("${app.security.user.password}") String userPass,
            @Value("${app.security.admin.name}") String adminName,
            @Value("${app.security.admin.password}") String adminPass) {

        PasswordEncoder encoder = passwordEncoder();

        UserDetails user = User.withUsername(userName)
                .password(encoder.encode(userPass))
                .roles("USER")
                .build();

        UserDetails admin = User.withUsername(adminName)
                .password(encoder.encode(adminPass))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user, admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

