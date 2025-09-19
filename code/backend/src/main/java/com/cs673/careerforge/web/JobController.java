package com.cs673.careerforge.web;

import com.cs673.careerforge.request.JobRequest;
import com.cs673.careerforge.response.ListJobResponse;
import com.cs673.careerforge.vo.JobVO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class JobController {

    @GetMapping("/jobs/{id}")
    public JobVO getJob(@PathVariable Long id, HttpServletRequest httpServletRequest) {
        return JobVO.builder().id(id).title("test title").location("test location").build();
    }

    @PostMapping("/jobs/save")
    public Boolean saveJob(@RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return true;
    }

    @PostMapping("/jobs/apply")
    public Boolean applyJob(@RequestBody JobRequest request, HttpServletRequest httpServletRequest) {
        return true;
    }

    @PostMapping("/jobs/all")
    public ListJobResponse listJob(HttpServletRequest httpServletRequest) {
        return ListJobResponse.builder().build();
    }
}
