package com.cs673.careerforge.repository;

import com.cs673.careerforge.entity.EmploymentType;
import com.cs673.careerforge.entity.Job;
import com.cs673.careerforge.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Job com.cs673.careerforge.entity operations.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    /**
     * Find jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @return list of jobs posted by the user
     */
    List<Job> findByPostedBy(User postedBy);
    
    /**
     * Find jobs by posted user with pagination.
     * @param postedBy the user who posted the jobs
     * @param pageable pagination information
     * @return page of jobs posted by the user
     */
    Page<Job> findByPostedBy(User postedBy, Pageable pageable);
    
    /**
     * Find active jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @param isActive whether the job is active
     * @return list of active jobs posted by the user
     */
    List<Job> findByPostedByAndIsActive(User postedBy, Boolean isActive);
    
    /**
     * Find jobs by title containing (case-insensitive).
     * @param title the title to search for
     * @return list of jobs with matching title
     */
    List<Job> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Find jobs by company containing (case-insensitive).
     * @param company the company to search for
     * @return list of jobs with matching company
     */
    List<Job> findByCompanyContainingIgnoreCase(String company);
    
    /**
     * Find jobs by location containing (case-insensitive).
     * @param location the location to search for
     * @return list of jobs with matching location
     */
    List<Job> findByLocationContainingIgnoreCase(String location);
    
    /**
     * Find jobs by employment type.
     * @param employmentType the employment type to filter by
     * @return list of jobs with the specified employment type
     */
    List<Job> findByEmploymentType(EmploymentType employmentType);
    
    /**
     * Find active jobs by employment type.
     * @param employmentType the employment type to filter by
     * @param isActive whether the job is active
     * @return list of active jobs with the specified employment type
     */
    List<Job> findByEmploymentTypeAndIsActive(EmploymentType employmentType, Boolean isActive);
    
    /**
     * Find jobs with salary range.
     * @param minSalary minimum salary
     * @param maxSalary maximum salary
     * @return list of jobs within the salary range
     */
    @Query("SELECT j FROM Job j WHERE " +
           "(:minSalary IS NULL OR j.salaryMin IS NULL OR j.salaryMin >= :minSalary) AND " +
           "(:maxSalary IS NULL OR j.salaryMax IS NULL OR j.salaryMax <= :maxSalary)")
    List<Job> findBySalaryRange(@Param("minSalary") BigDecimal minSalary, 
                                @Param("maxSalary") BigDecimal maxSalary);
    
    /**
     * Find active jobs with salary range.
     * @param minSalary minimum salary
     * @param maxSalary maximum salary
     * @param isActive whether the job is active
     * @return list of active jobs within the salary range
     */
    @Query("SELECT j FROM Job j WHERE " +
           "(:minSalary IS NULL OR j.salaryMin IS NULL OR j.salaryMin >= :minSalary) AND " +
           "(:maxSalary IS NULL OR j.salaryMax IS NULL OR j.salaryMax <= :maxSalary) AND " +
           "j.isActive = :isActive")
    List<Job> findBySalaryRangeAndIsActive(@Param("minSalary") BigDecimal minSalary, 
                                           @Param("maxSalary") BigDecimal maxSalary,
                                           @Param("isActive") Boolean isActive);
    
    /**
     * Find jobs created after a specific date.
     * @param createdAfter the date to filter by
     * @return list of jobs created after the specified date
     */
    List<Job> findByCreatedAtAfter(LocalDateTime createdAfter);
    
    /**
     * Find jobs created between two dates.
     * @param startDate the start date
     * @param endDate the end date
     * @return list of jobs created between the dates
     */
    List<Job> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find jobs with application deadline after a specific date.
     * @param deadlineAfter the date to filter by
     * @return list of jobs with deadline after the specified date
     */
    List<Job> findByApplicationDeadlineAfter(LocalDateTime deadlineAfter);
    
    /**
     * Find jobs with application deadline before a specific date.
     * @param deadlineBefore the date to filter by
     * @return list of jobs with deadline before the specified date
     */
    List<Job> findByApplicationDeadlineBefore(LocalDateTime deadlineBefore);
    
    /**
     * Find active jobs.
     * @param isActive whether the job is active
     * @return list of active jobs
     */
    List<Job> findByIsActive(Boolean isActive);
    
    /**
     * Find active jobs with pagination.
     * @param isActive whether the job is active
     * @param pageable pagination information
     * @return page of active jobs
     */
    Page<Job> findByIsActive(Boolean isActive, Pageable pageable);
    
    /**
     * Search jobs by multiple criteria.
     * @param title search term for job title (optional)
     * @param company search term for company (optional)
     * @param location search term for location (optional)
     * @param employmentType employment type filter (optional)
     * @param minSalary minimum salary filter (optional)
     * @param maxSalary maximum salary filter (optional)
     * @param isActive whether the job is active (optional)
     * @param pageable pagination and sorting information
     * @return page of jobs matching the criteria
     */
    @Query("SELECT j FROM Job j WHERE " +
           "(:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:company IS NULL OR LOWER(j.company) LIKE LOWER(CONCAT('%', :company, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:minSalary IS NULL OR j.salaryMin IS NULL OR j.salaryMin >= :minSalary) AND " +
           "(:maxSalary IS NULL OR j.salaryMax IS NULL OR j.salaryMax <= :maxSalary) AND " +
           "(:isActive IS NULL OR j.isActive = :isActive)")
    Page<Job> searchJobs(@Param("title") String title,
                         @Param("company") String company,
                         @Param("location") String location,
                         @Param("employmentType") EmploymentType employmentType,
                         @Param("minSalary") BigDecimal minSalary,
                         @Param("maxSalary") BigDecimal maxSalary,
                         @Param("isActive") Boolean isActive,
                         Pageable pageable);
    
    /**
     * Count jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @return number of jobs posted by the user
     */
    long countByPostedBy(User postedBy);
    
    /**
     * Count active jobs by posted user.
     * @param postedBy the user who posted the jobs
     * @param isActive whether the job is active
     * @return number of active jobs posted by the user
     */
    long countByPostedByAndIsActive(User postedBy, Boolean isActive);
    
    /**
     * Count jobs by employment type.
     * @param employmentType the employment type to count
     * @return number of jobs with the specified employment type
     */
    long countByEmploymentType(EmploymentType employmentType);
    
    /**
     * Count active jobs by employment type.
     * @param employmentType the employment type to count
     * @param isActive whether the job is active
     * @return number of active jobs with the specified employment type
     */
    long countByEmploymentTypeAndIsActive(EmploymentType employmentType, Boolean isActive);
    
    /**
     * Find jobs with pagination and sorting.
     * @param pageable pagination and sorting information
     * @return page of jobs
     */
    Page<Job> findAll(Pageable pageable);
    
    /**
     * Find recent jobs (created within last N days).
     * @param days number of days to look back
     * @return list of recent jobs
     */
    @Query("SELECT j FROM Job j WHERE j.createdAt >= :cutoffDate ORDER BY j.createdAt DESC")
    List<Job> findRecentJobs(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    /**
     * Find jobs expiring soon (deadline within next N days).
     * @param days number of days to look ahead
     * @return list of jobs expiring soon
     */
    @Query("SELECT j FROM Job j WHERE j.applicationDeadline IS NOT NULL AND " +
           "j.applicationDeadline BETWEEN :now AND :futureDate ORDER BY j.applicationDeadline ASC")
    List<Job> findJobsExpiringSoon(@Param("now") LocalDateTime now, 
                                   @Param("futureDate") LocalDateTime futureDate);
}
