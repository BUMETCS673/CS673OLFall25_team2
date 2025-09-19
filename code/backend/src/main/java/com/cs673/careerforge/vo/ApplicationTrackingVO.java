package com.cs673.careerforge.vo;

import com.cs673.careerforge.common.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ApplicationTrackingVO {

    private Long id;

    private UserVO applicant;

    private com.cs673.careerforge.domain.Job job;

    private ApplicationStatus applicationStatus;

    private LocalDateTime appliedDate;

    private LocalDateTime lastUpdated;

    private String notes;

    private String resumePath;

    private String coverLetter;

    private LocalDateTime interviewDate;

    private LocalDateTime followUpDate;
}
