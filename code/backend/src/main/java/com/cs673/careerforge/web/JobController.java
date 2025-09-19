package com.cs673.careerforge.web;

import com.cs673.careerforge.request.JobRequest;
import com.cs673.careerforge.response.ListJobResponse;
import com.cs673.careerforge.service.JobService;
import com.cs673.careerforge.vo.JobVO;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobController {

    // TODO: implement these methods

    @Resource
    private JobService jobService;

    @GetMapping("/jobs")
    public ListJobResponse listJob(HttpServletRequest httpServletRequest) {
        return ListJobResponse.builder().build();
    }

    @PostMapping("/jobs/{id}/save")
    public Boolean saveJob(@PathVariable Long id, @RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        jobService.saveJob(JobVO.builder().id(id).build());
        return true;
    }

    @PostMapping("/jobs/{id}/apply")
    public Boolean applyJob(@PathVariable Long id, @RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return true;
    }

    @DeleteMapping("/jobs/{id}")
    public Boolean deleteJob(@RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return true;
    }
}
