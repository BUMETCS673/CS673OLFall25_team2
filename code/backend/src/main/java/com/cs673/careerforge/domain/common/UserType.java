package com.cs673.careerforge.domain.common;

/**
 * Enum representing the type of user in the job tracking system.
 * Written by human.
 */
public enum UserType {
    EMPLOYEE("Employee"),
    EMPLOYER("Employer");
    
    private final String displayName;
    
    UserType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}
