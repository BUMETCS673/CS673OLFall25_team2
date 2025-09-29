package com.cs673.careerforge.web.controller;

<<<<<<< HEAD:code/backend/src/main/java/com/cs673/careerforge/web/controller/JobController.java
import com.cs673.careerforge.web.request.JobRequest;
import com.cs673.careerforge.web.request.ListJobRequest;
import com.cs673.careerforge.web.response.ListJobResponse;
=======
import com.cs673.careerforge.common.BaseResult;
import com.cs673.careerforge.request.DeleteJobRequest;
import com.cs673.careerforge.request.JobRequest;
import com.cs673.careerforge.request.ListJobRequest;
import com.cs673.careerforge.response.ListJobResponse;
import com.cs673.careerforge.service.ApplicationTrackingService;
>>>>>>> origin/dev:code/backend/src/main/java/com/cs673/careerforge/controller/JobController.java
import com.cs673.careerforge.service.JobService;
import com.cs673.careerforge.service.SavedJobService;
import com.cs673.careerforge.vo.ApplicationTrackingVO;
import com.cs673.careerforge.vo.JobVO;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

/**
 * Written by human.
 */
@RestController
public class JobController {

    @Resource
    private JobService jobService;

    @Autowired
    private SavedJobService savedJobService;

    @Autowired
    private ApplicationTrackingService applicationTrackingService;

    // saved jobs
    @PostMapping("/jobs/saved/list")
    public ListJobResponse listSavedJobs(@RequestBody ListJobRequest request, HttpServletRequest httpServletRequest) {
        return jobService.findAllSavedJobs(request);
    }

    @PostMapping("/jobs/saved/save")
    public BaseResult<JobVO> saveJob(@RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return BaseResult.ok(JobVO.builder()
                .id(savedJobService.saveJob(request).getId())
                .build());
    }

    @PostMapping("/jobs/saved/delete")
    public Boolean deleteSavedJob(@RequestBody DeleteJobRequest request, HttpServletRequest httpServletRequest) {
        return savedJobService.deleteSavedJobBatch(request);
    }

    // applied jobs
    @PostMapping("/jobs/applied/list")
    public ListJobResponse listAppliedJobs(@RequestBody ListJobRequest request, HttpServletRequest httpServletRequest) {
        return applicationTrackingService.findApplicationsByApplicant(request);
    }

    @PostMapping("/jobs/applied/apply")
    public BaseResult<JobVO> applyJob(@RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return BaseResult.ok(JobVO.builder()
                .id(applicationTrackingService.createApplication(request).getId())
                .build());
    }

    @PostMapping("/jobs/applied/delete")
    public Boolean deleteAppliedJob(@RequestBody DeleteJobRequest request, HttpServletRequest httpServletRequest) {
        return applicationTrackingService.deleteApplicationBatch(request);
    }
}
