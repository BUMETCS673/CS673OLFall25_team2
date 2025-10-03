package com.cs673.careerforge.security;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;
import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @DynamicPropertySource
    static void jwtProperties(DynamicPropertyRegistry registry) {
        String randomSecret = Base64.getEncoder()
                .encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded());
        registry.add("app.jwt.secret", () -> randomSecret);
    }

    @Test
    void contextLoads() {
        assertNotNull(jwtUtil);
    }

    @Test
    void registerUser_shouldReturnTokenAndUser() throws Exception {
        String uniqueEmail = "testuser_" + UUID.randomUUID() + "@example.com";

        String requestBody = """
        {
          "email": "%s",
          "password": "Sup3r$ecret!",
          "name": "First"
        }
        """.formatted(uniqueEmail);

        String response = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.token").exists())
                .andExpect(jsonPath("$.result.user.id").exists())
                .andExpect(jsonPath("$.result.user.email").value(uniqueEmail))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = JsonPath.parse(response).read("$.result.token", String.class);
        assertNotNull(token, "Token should not be null");
    }

    @Test
    void login_withCorrectCredentials_shouldReturnJwt() throws Exception {
        String uniqueEmail = "happylogin_" + UUID.randomUUID() + "@example.com";

        // Register first
        String registerBody = """
    {
          "email": "%s",
          "password": "happyPass123",
          "name": "First"
    }
    """.formatted(uniqueEmail);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(jsonPath("$.result.token").exists())
                .andExpect(jsonPath("$.result.user.email").value(uniqueEmail));

        // Login
        String response = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + uniqueEmail + "\", \"password\":\"happyPass123\"}"))
                .andExpect(status().isOk())       // 200 OK from AuthController
                .andExpect(jsonPath("$.result.token").exists())
                .andExpect(jsonPath("$.result.user.email").value(uniqueEmail))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = JsonPath.parse(response).read("$.result.token", String.class);
        assertNotNull(token, "JWT should not be null");
    }


    @Test
    void login_withWrongPassword_shouldFail() throws Exception {
        String uniqueEmail = "failuser_" + UUID.randomUUID() + "@example.com";

        // Register first
        String registerBody = """
        {
          "email": "user@example.com",
          "password": "Sup3r$ecret!",
          "name": "Fail User"
        }
        """.formatted(uniqueEmail);

        // Wrong password
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + uniqueEmail + "\", \"password\":\"wrongPassword\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.result.status").value(401))
                .andExpect(jsonPath("$.result.error").value("Unauthorized"))
                .andExpect(jsonPath("$.result.message").value("Invalid email or password"));
    }

    @Test
    void registerUser_withDuplicateEmail_shouldFail() throws Exception {
        String email = "duplicate_" + UUID.randomUUID() + "@example.com";

        String body = """
        { "name": "Test", "email": "%s", "password": "secret123" }
        """.formatted(email);

        // First registration works
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        // Second should fail
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.result.status").value(409))
                .andExpect(jsonPath("$.result.error").value("Conflict"))
                .andExpect(jsonPath("$.result.message").value("Email already exists: " + email))
                .andExpect(jsonPath("$.result.conflicts[0]").value("email"));
    }
}
