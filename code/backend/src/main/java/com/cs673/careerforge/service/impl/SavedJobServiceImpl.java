package com.cs673.careerforge.service.impl;

import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.SavedJob;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.exceptions.InvalidParamException;
import com.cs673.careerforge.mapper.JobMapper;
import com.cs673.careerforge.repository.JobRepository;
import com.cs673.careerforge.repository.SavedJobRepository;
import com.cs673.careerforge.repository.UserRepository;
import com.cs673.careerforge.request.DeleteJobRequest;
import com.cs673.careerforge.request.JobRequest;
import com.cs673.careerforge.service.SavedJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Written by human.
 */
@Service
@Transactional
public class SavedJobServiceImpl implements SavedJobService {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Override
    @Transactional
    public SavedJob saveJob(JobRequest request) {
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

        // return save record
        return savedJobRepository.save(new SavedJob(user, job));
    }

    @Override
    @Transactional
    public boolean deleteSavedJobBatch(DeleteJobRequest request) {
        if (request.getUid() == null || request.getJobIds() == null) {
            throw new InvalidParamException("UserId and JobId(s) are required");
        }
        // idempotent delete
        return savedJobRepository.deleteByUser_IdAndJob_IdIn(request.getUid(), request.getJobIds()) > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SavedJob> listMySavedJobs(Long currentUserId, Pageable pageable) {
        if (currentUserId == null) {
            throw new InvalidParamException("UserId is required");
        }
        return savedJobRepository.findByUser_IdOrderByCreatedAtDesc(currentUserId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSaved(Long currentUserId, Long jobId) {
        if (currentUserId == null || jobId == null) return false;
        return savedJobRepository.existsByUser_IdAndJob_Id(currentUserId, jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SavedJob> getMySavedJob(Long currentUserId, Long savedJobId) {
        if (currentUserId == null || savedJobId == null) return Optional.empty();
        return savedJobRepository.findById(savedJobId)
                .filter(sj -> sj.getUser().getId().equals(currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public long countSavesForJob(Long jobId) {
        if (jobId == null) return 0L;
        return savedJobRepository.countByJob_Id(jobId);
    }
}
