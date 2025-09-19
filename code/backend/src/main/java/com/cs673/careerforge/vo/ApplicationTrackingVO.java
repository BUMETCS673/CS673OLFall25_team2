package com.cs673.careerforge.vo;

import com.cs673.careerforge.common.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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

    private JobVO job;

    private ApplicationStatus applicationStatus;

    private long appliedDate;

    private long lastUpdated;

    private String notes;

    private String resumePath;

    private String coverLetter;

    private long interviewDate;

    private long followUpDate;
}
