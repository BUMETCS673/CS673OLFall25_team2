package com.cs673.careerforge.web.model;

//To return the JWT back to the client
/*
 AI-generated code: 100% (tool: ChatGPT)
*/

public class AuthResponse {
    private String jwt;

    public AuthResponse(String jwt) {
        this.jwt = jwt;
    }

    public String getJwt() {
        return jwt;
    }
}
