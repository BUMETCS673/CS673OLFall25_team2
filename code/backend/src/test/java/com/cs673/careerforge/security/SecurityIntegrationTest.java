package com.cs673.careerforge.security;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.context.ActiveProfiles;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Encoders;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Value("${app.security.user.name}")
    private String userName;

    @Value("${app.security.user.password}")
    private String userPass;

    @Value("${app.security.admin.name}")
    private String adminName;

    @Value("${app.security.admin.password}")
    private String adminPass;

    @DynamicPropertySource
    static void registerJwtSecret(DynamicPropertyRegistry registry) {
        byte[] key = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
        registry.add("app.jwt.secret", () -> Encoders.BASE64.encode(key));
    }

    @Test
    void accessSecureEndpoint_withUser_shouldPass() throws Exception {
        String token = obtainToken(userName, userPass);
        mockMvc.perform(get("/secure")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void accessAdminEndpoint_withAdmin_shouldPass() throws Exception {
        String token = obtainToken(adminName, adminPass);
        mockMvc.perform(get("/admin/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void accessAdminEndpoint_withUser_shouldFail() throws Exception {
        String token = obtainToken(userName, userPass);
        mockMvc.perform(get("/admin/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    private String obtainToken(String username, String password) throws Exception {
        String requestBody = String.format("{\"username\":\"%s\", \"password\":\"%s\"}", username, password);

        MvcResult result = mockMvc.perform(post("/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andReturn();

        // Extract token from response JSON
        return JsonPath.read(result.getResponse().getContentAsString(), "$.jwt");

    }
}
