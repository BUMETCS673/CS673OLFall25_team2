package com.cs673.careerforge.service;

import com.cs673.careerforge.common.EmploymentType;
import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.vo.JobVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for Job com.cs673.careerforge.entity operations.
 */
public interface JobService {
    
    /**
     * Create a new job posting.
     * @param job the job to create
     * @return the created job
     * @throws IllegalArgumentException if validation fails
     */
    Job saveJob(JobVO job);

    /**
     * Create a new job posting.
     * @param job the job to create
     * @return the created job
     * @throws IllegalArgumentException if validation fails
     */
    Job createJob(Job job);
    
    /**
     * Find job by ID.
     * @param id the job ID
     * @return Optional containing the job if found
     */
    Optional<Job> findById(Long id);
    
    /**
     * Update job information.
     * @param job the job to update
     * @return the updated job
     * @throws IllegalArgumentException if job not found or validation fails
     */
    Job updateJob(Job job);
    
    /**
     * Delete job by ID.
     * @param id the job ID
     * @throws IllegalArgumentException if job not found
     */
    void deleteJob(Long id);
    
    /**
     * Soft delete job (set isActive to false).
     * @param id the job ID
     * @throws IllegalArgumentException if job not found
     */
    void deactivateJob(Long id);
    
    /**
     * Activate job (set isActive to true).
     * @param id the job ID
     * @throws IllegalArgumentException if job not found
     */
    void activateJob(Long id);
    
    /**
     * Find all jobs.
     * @return list of all jobs
     */
    List<Job> findAllJobs();
    
    /**
     * Find all jobs with pagination.
     * @param pageable pagination information
     * @return page of jobs
     */
    Page<Job> findAllJobs(Pageable pageable);
    
    /**
     * Find active jobs.
     * @return list of active jobs
     */
    List<Job> findActiveJobs();
    
    /**
     * Find active jobs with pagination.
     * @param pageable pagination information
     * @return page of active jobs
     */
    Page<Job> findActiveJobs(Pageable pageable);
    
    /**
     * Find jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @return list of jobs posted by the user
     */
    List<Job> findJobsByPostedBy(User postedBy);
    
    /**
     * Find jobs by posted user with pagination.
     * @param postedBy the user who posted the jobs
     * @param pageable pagination information
     * @return page of jobs posted by the user
     */
    Page<Job> findJobsByPostedBy(User postedBy, Pageable pageable);
    
    /**
     * Find active jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @return list of active jobs posted by the user
     */
    List<Job> findActiveJobsByPostedBy(User postedBy);
    
    /**
     * Search jobs by criteria.
     * @param title search term for job title (optional)
     * @param company search term for company (optional)
     * @param location search term for location (optional)
     * @param employmentType employment type filter (optional)
     * @param minSalary minimum salary filter (optional)
     * @param maxSalary maximum salary filter (optional)
     * @param isActive whether the job is active (optional)
     * @param pageable pagination information
     * @return page of jobs matching the criteria
     */
    Page<Job> searchJobs(String title, String company, String location, 
                         EmploymentType employmentType, BigDecimal minSalary, 
                         BigDecimal maxSalary, Boolean isActive, Pageable pageable);
    
    /**
     * Find jobs by title containing (case-insensitive).
     * @param title the title to search for
     * @return list of jobs with matching title
     */
    List<Job> findByTitleContaining(String title);
    
    /**
     * Find jobs by company containing (case-insensitive).
     * @param company the company to search for
     * @return list of jobs with matching company
     */
    List<Job> findByCompanyContaining(String company);
    
    /**
     * Find jobs by location containing (case-insensitive).
     * @param location the location to search for
     * @return list of jobs with matching location
     */
    List<Job> findByLocationContaining(String location);
    
    /**
     * Find jobs by employment type.
     * @param employmentType the employment type to filter by
     * @return list of jobs with the specified employment type
     */
    List<Job> findByEmploymentType(EmploymentType employmentType);
    
    /**
     * Find active jobs by employment type.
     * @param employmentType the employment type to filter by
     * @return list of active jobs with the specified employment type
     */
    List<Job> findActiveJobsByEmploymentType(EmploymentType employmentType);
    
    /**
     * Find jobs with salary range.
     * @param minSalary minimum salary
     * @param maxSalary maximum salary
     * @return list of jobs within the salary range
     */
    List<Job> findBySalaryRange(BigDecimal minSalary, BigDecimal maxSalary);
    
    /**
     * Find recent jobs (created within last N days).
     * @param days number of days to look back
     * @return list of recent jobs
     */
    List<Job> findRecentJobs(int days);
    
    /**
     * Find jobs expiring soon (deadline within next N days).
     * @param days number of days to look ahead
     * @return list of jobs expiring soon
     */
    List<Job> findJobsExpiringSoon(int days);
    
    /**
     * Count jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @return number of jobs posted by the user
     */
    long countByPostedBy(User postedBy);
    
    /**
     * Count active jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @return number of active jobs posted by the user
     */
    long countActiveJobsByPostedBy(User postedBy);
    
    /**
     * Count jobs by employment type.
     * @param employmentType the employment type to count
     * @return number of jobs with the specified employment type
     */
    long countByEmploymentType(EmploymentType employmentType);
    
    /**
     * Count active jobs by employment type.
     * @param employmentType the employment type to count
     * @return number of active jobs with the specified employment type
     */
    long countActiveJobsByEmploymentType(EmploymentType employmentType);
    
    /**
     * Validate job data.
     * @param job the job to validate
     * @throws IllegalArgumentException if validation fails
     */
    void validateJob(Job job);
    
    /**
     * Check if user can modify job.
     * @param jobId the job ID
     * @param userId the user ID
     * @return true if user can modify the job
     */
    boolean canUserModifyJob(Long jobId, Long userId);
}
