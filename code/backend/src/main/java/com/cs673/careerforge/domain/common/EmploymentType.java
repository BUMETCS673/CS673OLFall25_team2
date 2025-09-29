package com.cs673.careerforge.domain.common;

/**
 * Enum representing the type of employment for job postings.
 * Written by human.
 */
public enum EmploymentType {
    FULL_TIME("Full Time"),
    PART_TIME("Part Time"),
    CONTRACT("Contract"),
    INTERNSHIP("Internship"),
    REMOTE("Remote");
    
    private final String displayName;
    
    EmploymentType(String displayName) {
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
