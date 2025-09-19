package com.cs673.careerforge.vo;

import com.cs673.careerforge.common.EmploymentType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class JobVO {

    private Long id;

    private Long postedBy;

    private String title;

    private String description;

    private String company;

    private String location;

    private EmploymentType employmentType;

    private BigDecimal salaryMin;

    private BigDecimal salaryMax;

    private String requirements;

    private String benefits;

    private long createdAt;

    private long updatedAt;

    private Boolean isActive = true;

    private LocalDateTime applicationDeadline;

    private String url;

    private String type;

    private String department;

    private String seniority;

    private String locationAddress;

    private LocationCoordinatesVO locationCoordinates;

    private List<ApplicationTrackingVO> applications;
}
