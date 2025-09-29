package com.cs673.careerforge.service.impl;

<<<<<<< HEAD
import com.cs673.careerforge.domain.common.ApplicationStatus;
import com.cs673.careerforge.domain.ApplicationTracking;
import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.data.ApplicationTrackingRepository;
=======
import com.cs673.careerforge.common.ApplicationStatus;
import com.cs673.careerforge.common.ResultEnum;
import com.cs673.careerforge.domain.ApplicationTracking;
import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.exceptions.InvalidParamException;
import com.cs673.careerforge.mapper.JobMapper;
import com.cs673.careerforge.repository.ApplicationTrackingRepository;
import com.cs673.careerforge.repository.JobRepository;
import com.cs673.careerforge.repository.UserRepository;
import com.cs673.careerforge.request.DeleteJobRequest;
import com.cs673.careerforge.request.JobRequest;
import com.cs673.careerforge.request.ListJobRequest;
import com.cs673.careerforge.response.ListJobResponse;
>>>>>>> origin/dev
import com.cs673.careerforge.service.ApplicationTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service implementation for ApplicationTracking com.cs673.careerforge.entity operations.
 * Written by human.
 */
@Service
@Transactional
public class ApplicationTrackingServiceImpl implements ApplicationTrackingService {
    
    @Autowired
    private ApplicationTrackingRepository applicationTrackingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;
    
    @Override
    public ApplicationTracking createApplication(JobRequest request) {
        if (request.getUid() == null) {
            throw new InvalidParamException("User Login required");
        }

        // ensure user exists & active
        User user = userRepository.findById(request.getUid())
                .orElseThrow(() -> new InvalidParamException("User not found: " + request.getUid()));
        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new InvalidParamException("User is inactive");
        }

        // ensure job exists & active
        Job job = jobRepository.save(JobMapper.INSTANCE.toDO(request));

        return applicationTrackingRepository.save(new ApplicationTracking(user, job));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ApplicationTracking> findById(Long id) {
        return applicationTrackingRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ApplicationTracking> findByApplicantAndJob(User applicant, Job job) {
        return applicationTrackingRepository.findByApplicantAndJob(applicant, job);
    }
    
    @Override
    public ApplicationTracking updateApplication(ApplicationTracking application) {
        if (application.getId() == null) {
            throw new InvalidParamException("Application ID is required for update");
        }
        
        ApplicationTracking existingApplication = applicationTrackingRepository.findById(application.getId())
                .orElseThrow(() -> new InvalidParamException("Application not found with ID: " + application.getId()));
        
        // Update fields
        existingApplication.setApplicationStatus(application.getApplicationStatus());
        existingApplication.setNotes(application.getNotes());
//        existingApplication.setResumePath(application.getResumePath());
        existingApplication.setCoverLetter(application.getCoverLetter());
        existingApplication.setInterviewDate(application.getInterviewDate());
        existingApplication.setFollowUpDate(application.getFollowUpDate());
        
        validateApplication(existingApplication);
        return applicationTrackingRepository.save(existingApplication);
    }

    @Override
    @Transactional
    public boolean deleteApplicationBatch(DeleteJobRequest request) {
        if (request.getUid() == null || request.getJobIds() == null) {
            throw new InvalidParamException("UserId and JobId(s) are required");
        }
        // idempotent delete
        return applicationTrackingRepository.deleteByApplicant_IdAndJob_IdIn(request.getUid(), request.getJobIds()) > 0;
    }

    @Override
    public void deleteApplication(Long id) {
        if (!applicationTrackingRepository.existsById(id)) {
            throw new InvalidParamException("Application not found with ID: " + id);
        }
        applicationTrackingRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsByApplicant(User applicant) {
        return applicationTrackingRepository.findByApplicant(applicant);
    }

    @Override
    public ListJobResponse findApplicationsByApplicant(ListJobRequest request) {
        if (request.getUid() == null) {
            throw new InvalidParamException("Uid is required for findApplicationsByApplicant");
        }
        User user = userRepository.findById(request.getUid())
                .orElseThrow(() -> new InvalidParamException(ResultEnum.BUSINESS_ERROR, "User not found"));
        Page<ApplicationTracking> page = findByApplicantOrderByLastUpdatedtDesc(user, PageRequest.of(request.getPage(), request.getSize()));
        return ListJobResponse.builder()
                .page(page.getTotalPages())
                .size(page.getSize())
                .total(page.getTotalElements())
                .jobs(page.map(j -> JobMapper.INSTANCE.toVO(j.getJob())).toList())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationTracking> findByApplicantOrderByLastUpdatedtDesc(User applicant, Pageable pageable) {
        return applicationTrackingRepository.findByApplicantOrderByLastUpdatedDesc(applicant, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsByJob(Job job) {
        return applicationTrackingRepository.findByJob(job);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationTracking> findApplicationsByJob(Job job, Pageable pageable) {
        return applicationTrackingRepository.findByJob(job, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsByStatus(ApplicationStatus applicationStatus) {
        return applicationTrackingRepository.findByApplicationStatus(applicationStatus);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsByApplicantAndStatus(User applicant, ApplicationStatus applicationStatus) {
        return applicationTrackingRepository.findByApplicantAndApplicationStatus(applicant, applicationStatus);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsByJobAndStatus(Job job, ApplicationStatus applicationStatus) {
        return applicationTrackingRepository.findByJobAndApplicationStatus(job, applicationStatus);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationTracking> findApplicationsByApplicantAndStatus(User applicant, 
                                                                          ApplicationStatus applicationStatus, 
                                                                          Pageable pageable) {
        return applicationTrackingRepository.findByApplicantAndStatus(applicant, applicationStatus, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationTracking> findApplicationsByJobAndStatus(Job job, 
                                                                    ApplicationStatus applicationStatus, 
                                                                    Pageable pageable) {
        return applicationTrackingRepository.findByJobAndStatus(job, applicationStatus, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsAppliedAfter(LocalDateTime appliedAfter) {
        return applicationTrackingRepository.findByAppliedDateAfter(appliedAfter);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsAppliedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return applicationTrackingRepository.findByAppliedDateBetween(startDate, endDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsWithInterviewScheduled() {
        return applicationTrackingRepository.findApplicationsWithInterviewScheduled();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsWithInterviewAfter(LocalDateTime interviewAfter) {
        return applicationTrackingRepository.findApplicationsWithInterviewAfter(interviewAfter);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsWithFollowUpScheduled() {
        return applicationTrackingRepository.findApplicationsWithFollowUpScheduled();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsWithFollowUpAfter(LocalDateTime followUpAfter) {
        return applicationTrackingRepository.findApplicationsWithFollowUpAfter(followUpAfter);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findApplicationsNeedingFollowUp() {
        return applicationTrackingRepository.findApplicationsNeedingFollowUp(LocalDateTime.now());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationTracking> findRecentApplications(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return applicationTrackingRepository.findRecentApplications(cutoffDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationTracking> searchApplications(User applicant, Job job, 
                                                        ApplicationStatus applicationStatus, 
                                                        LocalDateTime appliedAfter, 
                                                        Pageable pageable) {
        return applicationTrackingRepository.findByCriteria(applicant, job, applicationStatus, appliedAfter, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByApplicant(User applicant) {
        return applicationTrackingRepository.countByApplicant(applicant);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByJob(Job job) {
        return applicationTrackingRepository.countByJob(job);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByStatus(ApplicationStatus applicationStatus) {
        return applicationTrackingRepository.countByApplicationStatus(applicationStatus);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByApplicantAndStatus(User applicant, ApplicationStatus applicationStatus) {
        return applicationTrackingRepository.countByApplicantAndApplicationStatus(applicant, applicationStatus);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByJobAndStatus(Job job, ApplicationStatus applicationStatus) {
        return applicationTrackingRepository.countByJobAndApplicationStatus(job, applicationStatus);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByApplicantAndJob(User applicant, Job job) {
        return applicationTrackingRepository.existsByApplicantAndJob(applicant, job);
    }
    
    @Override
    public ApplicationTracking updateApplicationStatus(Long applicationId, ApplicationStatus newStatus) {
        ApplicationTracking application = applicationTrackingRepository.findById(applicationId)
                .orElseThrow(() -> new InvalidParamException("Application not found with ID: " + applicationId));
        
        application.setApplicationStatus(newStatus);
        return applicationTrackingRepository.save(application);
    }
    
    @Override
    public ApplicationTracking addNotes(Long applicationId, String notes) {
        ApplicationTracking application = applicationTrackingRepository.findById(applicationId)
                .orElseThrow(() -> new InvalidParamException("Application not found with ID: " + applicationId));
        
        if (notes != null && notes.length() > 2000) {
            throw new InvalidParamException("Notes cannot exceed 2000 characters");
        }
        
        application.setNotes(notes);
        return applicationTrackingRepository.save(application);
    }
    
    @Override
    public ApplicationTracking scheduleInterview(Long applicationId, LocalDateTime interviewDate) {
        ApplicationTracking application = applicationTrackingRepository.findById(applicationId)
                .orElseThrow(() -> new InvalidParamException("Application not found with ID: " + applicationId));
        
        if (interviewDate != null && interviewDate.isBefore(application.getAppliedDate())) {
            throw new InvalidParamException("Interview date cannot be before application date");
        }
        
        application.setInterviewDate(interviewDate);
        if (interviewDate != null) {
            application.setApplicationStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        }
        
        return applicationTrackingRepository.save(application);
    }
    
    @Override
    public ApplicationTracking scheduleFollowUp(Long applicationId, LocalDateTime followUpDate) {
        ApplicationTracking application = applicationTrackingRepository.findById(applicationId)
                .orElseThrow(() -> new InvalidParamException("Application not found with ID: " + applicationId));
        
        if (followUpDate != null && followUpDate.isBefore(application.getAppliedDate())) {
            throw new InvalidParamException("Follow-up date cannot be before application date");
        }
        
        application.setFollowUpDate(followUpDate);
        return applicationTrackingRepository.save(application);
    }
    
    @Override
    public void validateApplication(ApplicationTracking application) {
        if (application == null) {
            throw new InvalidParamException("Application cannot be null");
        }
        
        if (application.getApplicant() == null) {
            throw new InvalidParamException("Applicant is required");
        }
        
        if (application.getJob() == null) {
            throw new InvalidParamException("Job is required");
        }
        
        if (application.getApplicationStatus() == null) {
            throw new InvalidParamException("Application status is required");
        }
        
        // Validate notes length
        if (application.getNotes() != null && application.getNotes().length() > 2000) {
            throw new InvalidParamException("Notes cannot exceed 2000 characters");
        }
        
        // Validate cover letter length
        if (application.getCoverLetter() != null && application.getCoverLetter().length() > 5000) {
            throw new InvalidParamException("Cover letter cannot exceed 5000 characters");
        }
        
        // Validate resume path length
//        if (application.getResumePath() != null && application.getResumePath().length() > 255) {
//            throw new InvalidParamException("Resume path cannot exceed 255 characters");
//        }
        
        // Validate interview date
        if (application.getInterviewDate() != null && application.getInterviewDate().isBefore(application.getAppliedDate())) {
            throw new InvalidParamException("Interview date cannot be before application date");
        }
        
        // Validate follow-up date
        if (application.getFollowUpDate() != null && application.getFollowUpDate().isBefore(application.getAppliedDate())) {
            throw new InvalidParamException("Follow-up date cannot be before application date");
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean canUserModifyApplication(Long applicationId, Long userId) {
        Optional<ApplicationTracking> applicationOpt = applicationTrackingRepository.findById(applicationId);
        if (applicationOpt.isEmpty()) {
            return false;
        }
        
        ApplicationTracking application = applicationOpt.get();
        return application.getApplicant() != null && application.getApplicant().getId().equals(userId);
    }
}
