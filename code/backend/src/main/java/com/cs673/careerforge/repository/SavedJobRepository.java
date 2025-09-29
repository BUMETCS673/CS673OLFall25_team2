package com.cs673.careerforge.repository;

import com.cs673.careerforge.domain.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

/**
 * Written by human.
 */
@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    boolean existsByUser_IdAndJob_Id(Long userId, Long jobId);

    Optional<SavedJob> findByUser_IdAndJob_Id(Long userId, Long jobId);

    Page<SavedJob> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByJob_Id(Long jobId);

    int deleteByUser_IdAndJob_Id(Long userId, Long jobId);

    int deleteByUser_IdAndJob_IdIn(Long userId, Collection<Long> jobIds);
}
