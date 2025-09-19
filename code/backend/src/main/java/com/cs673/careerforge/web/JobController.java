package com.cs673.careerforge.web;

import com.cs673.careerforge.request.JobRequest;
import com.cs673.careerforge.request.ListJobRequest;
import com.cs673.careerforge.service.JobService;
import com.cs673.careerforge.vo.JobVO;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
public class JobController {

    @Resource
    private JobService jobService;

    @GetMapping("/jobs")
    public Page<JobVO> listJob(@RequestBody ListJobRequest request, HttpServletRequest httpServletRequest) {
        return jobService.findAllJobs(request);
    }

    @PostMapping("/jobs/{id}/save")
    public Boolean saveJob(@PathVariable Long id, @RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return Objects.nonNull(jobService.saveJob(id, request));
    }

    @PostMapping("/jobs/{id}/apply")
    public Boolean applyJob(@PathVariable Long id, @RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return Objects.nonNull(jobService.applyJob(id, request));
    }

    @DeleteMapping("/jobs/{id}")
    public Boolean deleteJob(@PathVariable Long id, HttpServletRequest httpServletRequest) {
        return jobService.deleteJob(id);
    }
}
