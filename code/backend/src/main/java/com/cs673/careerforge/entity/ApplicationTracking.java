package com.cs673.careerforge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

/**
 * ApplicationTracking com.cs673.careerforge.entity representing job applications by employees.
 */
@Entity
@Table(name = "application_tracking",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"applicant", "job"})
       })
public class ApplicationTracking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Applicant is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant", nullable = false)
    private User applicant;
    
    @NotNull(message = "Job is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job", nullable = false)
    private Job job;
    
    @NotNull(message = "Application status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private ApplicationStatus applicationStatus;
    
    @Column(name = "applied_date", nullable = false, updatable = false)
    private LocalDateTime appliedDate;
    
    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;
    
    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
//    @Size(max = 255, message = "Resume path must not exceed 255 characters")
//    @Column(name = "resume_path", length = 255)
//    private String resumePath;
    
    @Size(max = 5000, message = "Cover letter must not exceed 5000 characters")
    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;
    
    @Column(name = "interview_date")
    private LocalDateTime interviewDate;
    
    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;
    
    // Constructors
    public ApplicationTracking() {
        this.appliedDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
        this.applicationStatus = ApplicationStatus.APPLIED;
    }
    
    public ApplicationTracking(User applicant, Job job) {
        this();
        this.applicant = applicant;
        this.job = job;
    }
    
    public ApplicationTracking(User applicant, Job job, ApplicationStatus status) {
        this(applicant, job);
        this.applicationStatus = status;
    }
    
    // JPA Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        this.appliedDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Validation methods
    @AssertTrue(message = "Interview date must be in the future")
    public boolean isValidInterviewDate() {
        if (interviewDate == null) {
            return true; // Interview date is optional
        }
        return interviewDate.isAfter(appliedDate);
    }
    
    @AssertTrue(message = "Follow-up date must be in the future")
    public boolean isValidFollowUpDate() {
        if (followUpDate == null) {
            return true; // Follow-up date is optional
        }
        return followUpDate.isAfter(appliedDate);
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getApplicant() {
        return applicant;
    }
    
    public void setApplicant(User applicant) {
        this.applicant = applicant;
    }
    
    public Job getJob() {
        return job;
    }
    
    public void setJob(Job job) {
        this.job = job;
    }
    
    public ApplicationStatus getApplicationStatus() {
        return applicationStatus;
    }
    
    public void setApplicationStatus(ApplicationStatus applicationStatus) {
        this.applicationStatus = applicationStatus;
    }
    
    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }
    
    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
//    public String getResumePath() {
//        return resumePath;
//    }
//
//    public void setResumePath(String resumePath) {
//        this.resumePath = resumePath;
//    }
    
    public String getCoverLetter() {
        return coverLetter;
    }
    
    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
    
    public LocalDateTime getInterviewDate() {
        return interviewDate;
    }
    
    public void setInterviewDate(LocalDateTime interviewDate) {
        this.interviewDate = interviewDate;
    }
    
    public LocalDateTime getFollowUpDate() {
        return followUpDate;
    }
    
    public void setFollowUpDate(LocalDateTime followUpDate) {
        this.followUpDate = followUpDate;
    }
    
    // Utility methods
//    public boolean hasResume() {
//        return resumePath != null && !resumePath.trim().isEmpty();
//    }
    
    public boolean hasCoverLetter() {
        return coverLetter != null && !coverLetter.trim().isEmpty();
    }
    
    public boolean hasNotes() {
        return notes != null && !notes.trim().isEmpty();
    }
    
    public boolean isInterviewScheduled() {
        return interviewDate != null;
    }
    
    public boolean isFollowUpScheduled() {
        return followUpDate != null;
    }
    
    public boolean isActive() {
        return !ApplicationStatus.REJECTED.equals(applicationStatus) && 
               !ApplicationStatus.ACCEPTED.equals(applicationStatus) && 
               !ApplicationStatus.WITHDRAWN.equals(applicationStatus);
    }
    
    public boolean isCompleted() {
        return ApplicationStatus.REJECTED.equals(applicationStatus) || 
               ApplicationStatus.ACCEPTED.equals(applicationStatus);
    }
    
    public long getDaysSinceApplied() {
        return java.time.Duration.between(appliedDate, LocalDateTime.now()).toDays();
    }
    
    @Override
    public String toString() {
        return "ApplicationTracking{" +
                "id=" + id +
                ", applicant=" + (applicant != null ? applicant.getUsername() : "null") +
                ", job=" + (job != null ? job.getTitle() : "null") +
                ", applicationStatus=" + applicationStatus +
                ", appliedDate=" + appliedDate +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApplicationTracking that = (ApplicationTracking) o;
        return id != null && id.equals(that.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
