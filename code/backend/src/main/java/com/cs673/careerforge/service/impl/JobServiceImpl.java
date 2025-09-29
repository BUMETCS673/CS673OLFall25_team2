package com.cs673.careerforge.service.impl;

<<<<<<< HEAD
import com.cs673.careerforge.domain.common.EmploymentType;
=======
import com.cs673.careerforge.common.ApplicationStatus;
import com.cs673.careerforge.common.EmploymentType;
import com.cs673.careerforge.common.ResultEnum;
import com.cs673.careerforge.domain.ApplicationTracking;
>>>>>>> origin/dev
import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.SavedJob;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.exceptions.InvalidParamException;
import com.cs673.careerforge.mapper.JobMapper;
<<<<<<< HEAD
import com.cs673.careerforge.data.JobRepository;
import com.cs673.careerforge.web.request.JobRequest;
import com.cs673.careerforge.web.request.ListJobRequest;
import com.cs673.careerforge.web.response.ListJobResponse;
=======
import com.cs673.careerforge.repository.ApplicationTrackingRepository;
import com.cs673.careerforge.repository.JobRepository;
import com.cs673.careerforge.repository.SavedJobRepository;
import com.cs673.careerforge.repository.UserRepository;
import com.cs673.careerforge.request.ListJobRequest;
import com.cs673.careerforge.response.ListJobResponse;
>>>>>>> origin/dev
import com.cs673.careerforge.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service implementation for Job com.cs673.careerforge.entity operations.
 * Written by human.
 */
@Service
@Transactional
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationTrackingRepository applicationTrackingRepository;

    @Override
    public boolean applyJob(long uid, long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new InvalidParamException(ResultEnum.BUSINESS_ERROR, "Job not found"));
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new InvalidParamException(ResultEnum.BUSINESS_ERROR, "User not found"));
        applicationTrackingRepository.save(new ApplicationTracking(user, job, ApplicationStatus.APPLIED));
        return true;
    }

    @Override
    public Job createJob(Job job) {
        validateJob(job);
        return jobRepository.save(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Job> findById(Long id) {
        return jobRepository.findById(id);
    }

    @Override
    public Job updateJob(Job job) {
        if (job.getId() == null) {
            throw new InvalidParamException("Job ID is required for update");
        }

        Job existingJob = jobRepository.findById(job.getId())
                .orElseThrow(() -> new InvalidParamException("Job not found with ID: " + job.getId()));

        // Update fields
        existingJob.setTitle(job.getTitle());
        existingJob.setDescription(job.getDescription());
        existingJob.setCompany(job.getCompany());
        existingJob.setLocation(job.getLocation());
        existingJob.setEmploymentType(job.getEmploymentType());
        existingJob.setSalaryMin(job.getSalaryMin());
        existingJob.setSalaryMax(job.getSalaryMax());
        existingJob.setRequirements(job.getRequirements());
        existingJob.setBenefits(job.getBenefits());
        existingJob.setApplicationDeadline(job.getApplicationDeadline());
        existingJob.setIsActive(job.getIsActive());

        // Update new fields
        existingJob.setUrl(job.getUrl());
        existingJob.setType(job.getType());
        existingJob.setDepartment(job.getDepartment());
        existingJob.setSeniority(job.getSeniority());
        existingJob.setLocationAddress(job.getLocationAddress());
        existingJob.setLocationCoordinates(job.getLocationCoordinates());

        validateJob(existingJob);
        return jobRepository.save(existingJob);
    }

    @Override
    public boolean deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new InvalidParamException("Job not found with ID: " + id);
        }
        jobRepository.deleteById(id);
        return true;
    }

    @Override
    public void deactivateJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new InvalidParamException("Job not found with ID: " + id));
        job.setIsActive(false);
        jobRepository.save(job);
    }

    @Override
    public void activateJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new InvalidParamException("Job not found with ID: " + id));
        job.setIsActive(true);
        jobRepository.save(job);
    }

    @Override
    @Transactional(readOnly = true)
    public ListJobResponse findAllSavedJobs(ListJobRequest request) {
        Page<SavedJob> savedJobs = savedJobRepository.findByUser_IdOrderByCreatedAtDesc(request.getUid(), PageRequest.of(request.getPage(), request.getSize()));
        return ListJobResponse.builder()
                .page(savedJobs.getTotalPages())
                .size(savedJobs.getSize())
                .total(savedJobs.getTotalElements())
                .jobs(savedJobs.map(j -> JobMapper.INSTANCE.toVO(j.getJob())).toList())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Job> findAllSavedJobs(Pageable pageable) {
        return jobRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findActiveJobs() {
        return jobRepository.findByIsActive(true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Job> findActiveJobs(Pageable pageable) {
        return jobRepository.findByIsActive(true, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findJobsByPostedBy(User postedBy) {
        return jobRepository.findByPostedBy(postedBy);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Job> findJobsByPostedBy(User postedBy, Pageable pageable) {
        return jobRepository.findByPostedBy(postedBy, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findActiveJobsByPostedBy(User postedBy) {
        return jobRepository.findByPostedByAndIsActive(postedBy, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Job> searchJobs(String title, String company, String location,
                                EmploymentType employmentType, BigDecimal minSalary,
                                BigDecimal maxSalary, Boolean isActive, Pageable pageable) {
        return jobRepository.searchJobs(title, company, location, employmentType,
                minSalary, maxSalary, isActive, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findByTitleContaining(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findByCompanyContaining(String company) {
        return jobRepository.findByCompanyContainingIgnoreCase(company);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findByLocationContaining(String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findByEmploymentType(EmploymentType employmentType) {
        return jobRepository.findByEmploymentType(employmentType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findActiveJobsByEmploymentType(EmploymentType employmentType) {
        return jobRepository.findByEmploymentTypeAndIsActive(employmentType, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findBySalaryRange(BigDecimal minSalary, BigDecimal maxSalary) {
        return jobRepository.findBySalaryRange(minSalary, maxSalary);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findRecentJobs(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return jobRepository.findRecentJobs(cutoffDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> findJobsExpiringSoon(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureDate = now.plusDays(days);
        return jobRepository.findJobsExpiringSoon(now, futureDate);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByPostedBy(User postedBy) {
        return jobRepository.countByPostedBy(postedBy);
    }

    @Override
    @Transactional(readOnly = true)
    public long countActiveJobsByPostedBy(User postedBy) {
        return jobRepository.countByPostedByAndIsActive(postedBy, true);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByEmploymentType(EmploymentType employmentType) {
        return jobRepository.countByEmploymentType(employmentType);
    }

    @Override
    @Transactional(readOnly = true)
    public long countActiveJobsByEmploymentType(EmploymentType employmentType) {
        return jobRepository.countByEmploymentTypeAndIsActive(employmentType, true);
    }

    @Override
    public void validateJob(Job job) {
        if (job == null) {
            throw new InvalidParamException("Job cannot be null");
        }

        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            throw new InvalidParamException("Job title is required");
        }

        if (job.getDescription() == null || job.getDescription().trim().isEmpty()) {
            throw new InvalidParamException("Job description is required");
        }

        if (job.getCompany() == null || job.getCompany().trim().isEmpty()) {
            throw new InvalidParamException("Company name is required");
        }

        if (job.getLocation() == null || job.getLocation().trim().isEmpty()) {
            throw new InvalidParamException("Job location is required");
        }

        if (job.getEmploymentType() == null) {
            throw new InvalidParamException("Employment type is required");
        }

        if (job.getPostedBy() == null) {
            throw new InvalidParamException("Posted by user is required");
        }

        // Validate salary range
        if (job.getSalaryMin() != null && job.getSalaryMax() != null) {
            if (job.getSalaryMin().compareTo(job.getSalaryMax()) > 0) {
                throw new InvalidParamException("Minimum salary cannot be greater than maximum salary");
            }
        }

        // Validate salary values
        if (job.getSalaryMin() != null && job.getSalaryMin().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidParamException("Minimum salary cannot be negative");
        }

        if (job.getSalaryMax() != null && job.getSalaryMax().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidParamException("Maximum salary cannot be negative");
        }

        // Validate application deadline
        if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDateTime.now())) {
            throw new InvalidParamException("Application deadline must be in the future");
        }

        // Validate description length
        if (job.getDescription().length() > 5000) {
            throw new InvalidParamException("Job description cannot exceed 5000 characters");
        }

        // Validate requirements length
        if (job.getRequirements() != null && job.getRequirements().length() > 5000) {
            throw new InvalidParamException("Requirements cannot exceed 5000 characters");
        }

        // Validate benefits length
        if (job.getBenefits() != null && job.getBenefits().length() > 5000) {
            throw new InvalidParamException("Benefits cannot exceed 5000 characters");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUserModifyJob(Long jobId, Long userId) {
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            return false;
        }

        Job job = jobOpt.get();
        return job.getPostedBy() != null && job.getPostedBy().equals(userId);
    }
}
