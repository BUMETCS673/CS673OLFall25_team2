package com.cs673.careerforge.service;

import com.cs673.careerforge.domain.SavedJob;
import com.cs673.careerforge.request.DeleteJobRequest;
import com.cs673.careerforge.request.JobRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Written by human.
 */
public interface SavedJobService {

    /**
     * Save (bookmark) a job for current user. Idempotent.
     */
    SavedJob saveJob(JobRequest request);

    /**
     * Unsave a job for current user. Idempotent (no-op if not exists).
     */
    boolean deleteSavedJobBatch(DeleteJobRequest request);

    /**
     * List my saved jobs (paged).
     */
    Page<SavedJob> listMySavedJobs(Long currentUserId, Pageable pageable);

    /**
     * Check whether a job is saved by current user.
     */
    boolean isSaved(Long currentUserId, Long jobId);

    /**
     * Get one saved record (ownership enforced).
     */
    Optional<SavedJob> getMySavedJob(Long currentUserId, Long savedJobId);

    /**
     * Count total saves for a job.
     */
    long countSavesForJob(Long jobId);
}
