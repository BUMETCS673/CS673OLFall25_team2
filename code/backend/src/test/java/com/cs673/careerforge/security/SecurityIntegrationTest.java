package com.cs673.careerforge.security;

/*
 AI-generated code: 90% (tool: ChatGPT, modified and adapted)
 Human code: 10%
*/

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
import static org.junit.jupiter.api.Assertions.assertNotNull;
import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Encoders;
import org.springframework.context.annotation.Import;


import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestJwtConfig.class)
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.security.user.name}")
    private String userName;

    @Value("${app.security.user.password}")
    private String userPass;

    @Value("${app.security.admin.name}")
    private String adminName;

    @Value("${app.security.admin.password}")
    private String adminPass;

    @DynamicPropertySource
    static void jwtProperties(DynamicPropertyRegistry registry) {
        // Generate a fresh Base64 secret for this test run
        String randomSecret = Base64.getEncoder()
                .encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded());
        registry.add("app.jwt.secret", () -> randomSecret);
    }

    @Test
    void contextLoads() {
        assertNotNull(jwtUtil);
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
        String response = mockMvc.perform(post("/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"" + username + "\", \"password\":\"" + password + "\"}"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        System.out.println("Auth response: " + response);

        return JsonPath.read(response, "$.result.jwt");

    }

}
