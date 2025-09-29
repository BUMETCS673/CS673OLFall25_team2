package com.cs673.careerforge;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;
import com.cs673.careerforge.security.TestJwtConfig;


@SpringBootTest
@ActiveProfiles("test")
@Import(TestJwtConfig.class)
class CareerForgeApplicationTests {

	@Test
	void contextLoads() {
	}

}
