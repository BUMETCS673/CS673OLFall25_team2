package com.cs673.careerforge.health;

/*
 AI-generated code: 100% (tool: ChatGPT)
*/

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import com.cs673.careerforge.security.JwtUtil;

@Component
public class JwtHealthIndicator implements HealthIndicator {

    private final JwtUtil jwtUtil;

    public JwtHealthIndicator(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Health health() {
        try {
            if (jwtUtil.getSigningKey() != null) {
                return Health.up()
                        .withDetail("jwt", "Secret key is loaded")
                        .build();
            } else {
                return Health.down()
                        .withDetail("jwt", "Secret key is null")
                        .build();
            }
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
