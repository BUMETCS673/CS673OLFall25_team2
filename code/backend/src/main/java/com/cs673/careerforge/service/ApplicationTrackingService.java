package com.cs673.careerforge.service;

import com.cs673.careerforge.domain.common.ApplicationStatus;
import com.cs673.careerforge.domain.ApplicationTracking;
import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for ApplicationTracking com.cs673.careerforge.entity operations.
 * Written by human.
 */
public interface ApplicationTrackingService {
    
    /**
     * Create a new job application.
     * @param application the application to create
     * @return the created application
     * @throws IllegalArgumentException if validation fails or application already exists
     */
    ApplicationTracking createApplication(ApplicationTracking application);
    
    /**
     * Find application by ID.
     * @param id the application ID
     * @return Optional containing the application if found
     */
    Optional<ApplicationTracking> findById(Long id);
    
    /**
     * Find application by applicant and job.
     * @param applicant the applicant user
     * @param job the job
     * @return Optional containing the application if found
     */
    Optional<ApplicationTracking> findByApplicantAndJob(User applicant, Job job);
    
    /**
     * Update application information.
     * @param application the application to update
     * @return the updated application
     * @throws IllegalArgumentException if application not found or validation fails
     */
    ApplicationTracking updateApplication(ApplicationTracking application);
    
    /**
     * Delete application by ID.
     * @param id the application ID
     * @throws IllegalArgumentException if application not found
     */
    void deleteApplication(Long id);
    
    /**
     * Find applications by applicant.
     * @param applicant the applicant user
     * @return list of applications by the applicant
     */
    List<ApplicationTracking> findApplicationsByApplicant(User applicant);
    
    /**
     * Find applications by applicant with pagination.
     * @param applicant the applicant user
     * @param pageable pagination information
     * @return page of applications by the applicant
     */
    Page<ApplicationTracking> findApplicationsByApplicant(User applicant, Pageable pageable);
    
    /**
     * Find applications by job.
     * @param job the job
     * @return list of applications for the job
     */
    List<ApplicationTracking> findApplicationsByJob(Job job);
    
    /**
     * Find applications by job with pagination.
     * @param job the job
     * @param pageable pagination information
     * @return page of applications for the job
     */
    Page<ApplicationTracking> findApplicationsByJob(Job job, Pageable pageable);
    
    /**
     * Find applications by status.
     * @param applicationStatus the application status to filter by
     * @return list of applications with the specified status
     */
    List<ApplicationTracking> findApplicationsByStatus(ApplicationStatus applicationStatus);
    
    /**
     * Find applications by applicant and status.
     * @param applicant the applicant user
     * @param applicationStatus the application status to filter by
     * @return list of applications by the applicant with the specified status
     */
    List<ApplicationTracking> findApplicationsByApplicantAndStatus(User applicant, ApplicationStatus applicationStatus);
    
    /**
     * Find applications by job and status.
     * @param job the job
     * @param applicationStatus the application status to filter by
     * @return list of applications for the job with the specified status
     */
    List<ApplicationTracking> findApplicationsByJobAndStatus(Job job, ApplicationStatus applicationStatus);
    
    /**
     * Find applications by applicant with pagination and status filter.
     * @param applicant the applicant user
     * @param applicationStatus the application status to filter by (optional)
     * @param pageable pagination information
     * @return page of applications by the applicant
     */
    Page<ApplicationTracking> findApplicationsByApplicantAndStatus(User applicant, 
                                                                   ApplicationStatus applicationStatus, 
                                                                   Pageable pageable);
    
    /**
     * Find applications by job with pagination and status filter.
     * @param job the job
     * @param applicationStatus the application status to filter by (optional)
     * @param pageable pagination information
     * @return page of applications for the job
     */
    Page<ApplicationTracking> findApplicationsByJobAndStatus(Job job, 
                                                             ApplicationStatus applicationStatus, 
                                                             Pageable pageable);
    
    /**
     * Find applications applied after a specific date.
     * @param appliedAfter the date to filter by
     * @return list of applications applied after the specified date
     */
    List<ApplicationTracking> findApplicationsAppliedAfter(LocalDateTime appliedAfter);
    
    /**
     * Find applications applied between two dates.
     * @param startDate the start date
     * @param endDate the end date
     * @return list of applications applied between the dates
     */
    List<ApplicationTracking> findApplicationsAppliedBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find applications with interview scheduled.
     * @return list of applications with interview scheduled
     */
    List<ApplicationTracking> findApplicationsWithInterviewScheduled();
    
    /**
     * Find applications with interview scheduled after a specific date.
     * @param interviewAfter the date to filter by
     * @return list of applications with interview scheduled after the specified date
     */
    List<ApplicationTracking> findApplicationsWithInterviewAfter(LocalDateTime interviewAfter);
    
    /**
     * Find applications with follow-up scheduled.
     * @return list of applications with follow-up scheduled
     */
    List<ApplicationTracking> findApplicationsWithFollowUpScheduled();
    
    /**
     * Find applications with follow-up scheduled after a specific date.
     * @param followUpAfter the date to filter by
     * @return list of applications with follow-up scheduled after the specified date
     */
    List<ApplicationTracking> findApplicationsWithFollowUpAfter(LocalDateTime followUpAfter);
    
    /**
     * Find applications that need follow-up (follow-up date has passed).
     * @return list of applications that need follow-up
     */
    List<ApplicationTracking> findApplicationsNeedingFollowUp();
    
    /**
     * Find recent applications (applied within last N days).
     * @param days number of days to look back
     * @return list of recent applications
     */
    List<ApplicationTracking> findRecentApplications(int days);
    
    /**
     * Search applications by multiple criteria with pagination.
     * @param applicant the applicant user (optional)
     * @param job the job (optional)
     * @param applicationStatus the application status (optional)
     * @param appliedAfter the date to filter by (optional)
     * @param pageable pagination and sorting information
     * @return page of applications matching the criteria
     */
    Page<ApplicationTracking> searchApplications(User applicant, Job job, 
                                                 ApplicationStatus applicationStatus, 
                                                 LocalDateTime appliedAfter, 
                                                 Pageable pageable);
    
    /**
     * Count applications by applicant.
     * @param applicant the applicant user
     * @return number of applications by the applicant
     */
    long countByApplicant(User applicant);
    
    /**
     * Count applications by job.
     * @param job the job
     * @return number of applications for the job
     */
    long countByJob(Job job);
    
    /**
     * Count applications by status.
     * @param applicationStatus the application status to count
     * @return number of applications with the specified status
     */
    long countByStatus(ApplicationStatus applicationStatus);
    
    /**
     * Count applications by applicant and status.
     * @param applicant the applicant user
     * @param applicationStatus the application status to count
     * @return number of applications by the applicant with the specified status
     */
    long countByApplicantAndStatus(User applicant, ApplicationStatus applicationStatus);
    
    /**
     * Count applications by job and status.
     * @param job the job
     * @param applicationStatus the application status to count
     * @return number of applications for the job with the specified status
     */
    long countByJobAndStatus(Job job, ApplicationStatus applicationStatus);
    
    /**
     * Check if application exists for applicant and job.
     * @param applicant the applicant user
     * @param job the job
     * @return true if application exists
     */
    boolean existsByApplicantAndJob(User applicant, Job job);
    
    /**
     * Update application status.
     * @param applicationId the application ID
     * @param newStatus the new status
     * @return the updated application
     * @throws IllegalArgumentException if application not found
     */
    ApplicationTracking updateApplicationStatus(Long applicationId, ApplicationStatus newStatus);
    
    /**
     * Add notes to application.
     * @param applicationId the application ID
     * @param notes the notes to add
     * @return the updated application
     * @throws IllegalArgumentException if application not found
     */
    ApplicationTracking addNotes(Long applicationId, String notes);
    
    /**
     * Schedule interview for application.
     * @param applicationId the application ID
     * @param interviewDate the interview date
     * @return the updated application
     * @throws IllegalArgumentException if application not found or date is invalid
     */
    ApplicationTracking scheduleInterview(Long applicationId, LocalDateTime interviewDate);
    
    /**
     * Schedule follow-up for application.
     * @param applicationId the application ID
     * @param followUpDate the follow-up date
     * @return the updated application
     * @throws IllegalArgumentException if application not found or date is invalid
     */
    ApplicationTracking scheduleFollowUp(Long applicationId, LocalDateTime followUpDate);
    
    /**
     * Validate application data.
     * @param application the application to validate
     * @throws IllegalArgumentException if validation fails
     */
    void validateApplication(ApplicationTracking application);
    
    /**
     * Check if user can modify application.
     * @param applicationId the application ID
     * @param userId the user ID
     * @return true if user can modify the application
     */
    boolean canUserModifyApplication(Long applicationId, Long userId);
}
