package com.cs673.CurseForge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class CurseForgeApplication {

	public static void main(String[] args) {
		SpringApplication.run(CurseForgeApplication.class, args);
	}
}
