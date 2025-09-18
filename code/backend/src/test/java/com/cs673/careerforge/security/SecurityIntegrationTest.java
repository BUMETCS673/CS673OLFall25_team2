package com.cs673.careerforge.security;

import com.cs673.careerforge.controllers.SecureController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SecureController.class)
@Import(TestSecurityConfig.class) // lightweight security for tests
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtUtil jwtUtil; // <== MOCKED, no real secret needed

    @Test
    void accessSecureEndpoint_withValidToken_shouldPass() throws Exception {
        mockMvc.perform(get("/secure")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk());
    }

    @Test
    void accessSecureEndpoint_withInvalidToken_shouldFail() throws Exception {
        mockMvc.perform(get("/secure")
                        .header("Authorization", "Bearer invalidtoken"))
                .andExpect(status().isForbidden()); // 403, not 401
    }

    @Test
    void accessSecureEndpoint_withoutToken_shouldFail() throws Exception {
        mockMvc.perform(get("/secure"))
                .andExpect(status().isForbidden()); // 403, not 401
    }
}
