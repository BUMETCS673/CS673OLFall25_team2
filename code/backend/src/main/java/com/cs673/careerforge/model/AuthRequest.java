package com.cs673.careerforge.model;

//*For testing to hold login credentials from the request

public class AuthRequest {
    private String username;
    private String password;

    public AuthRequest(String username, String password) {
    this.username = username;
    this.password = password;
    }

    public String getUsername() {
    return username;
    }

    public String getPassword() {
    return password;
    }

    public void setUsername(String username) {
    this.username = username;
    }

    public void setPassword(String password) {
    this.password = password;
    }

}
