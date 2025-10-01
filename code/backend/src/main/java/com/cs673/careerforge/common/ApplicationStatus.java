package com.cs673.careerforge.common;

/**
 * Enum representing the status of a job application.
 * Written by human.
 */
public enum ApplicationStatus {
    APPLIED("Applied"),
    UNDER_REVIEW("Under Review"),
    INTERVIEW_SCHEDULED("Interview Scheduled"),
    REJECTED("Rejected"),
    ACCEPTED("Accepted"),
    WITHDRAWN("Withdrawn");
    
    private final String displayName;
    
    ApplicationStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    /**
     * Check if the status represents an active application.
     * @return true if the application is still active (not completed)
     */
    public boolean isActive() {
        return this != REJECTED && this != ACCEPTED && this != WITHDRAWN;
    }
    
    /**
     * Check if the status represents a completed application.
     * @return true if the application is completed
     */
    public boolean isCompleted() {
        return this == REJECTED || this == ACCEPTED;
    }
    
    /**
     * Check if the status represents a positive outcome.
     * @return true if the application was accepted
     */
    public boolean isPositive() {
        return this == ACCEPTED;
    }
    
    /**
     * Check if the status represents a negative outcome.
     * @return true if the application was rejected or withdrawn
     */
    public boolean isNegative() {
        return this == REJECTED || this == WITHDRAWN;
    }
}
