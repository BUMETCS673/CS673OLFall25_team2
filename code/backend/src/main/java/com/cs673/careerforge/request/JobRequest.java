package com.cs673.careerforge.request;

import com.cs673.careerforge.common.EmploymentType;
import com.cs673.careerforge.vo.LocationCoordinatesVO;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

/**
 * Written by Human.
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class JobRequest extends BaseRequest {

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

    private long applicationDeadline;

    private String url;

    private String type;

    private String department;

    private String seniority;

    private String locationAddress;

    private LocationCoordinatesVO locationCoordinates;
}
