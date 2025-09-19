package com.cs673.careerforge.request;

import com.cs673.careerforge.common.EmploymentType;
import com.cs673.careerforge.vo.ApplicationTrackingVO;
import com.cs673.careerforge.vo.LocationCoordinatesVO;
import com.cs673.careerforge.vo.UserVO;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class JobRequest extends BaseRequest {

    private Long id;

    private UserVO postedBy;

    private String title;

    private String description;

    private String company;

    private String location;

    private EmploymentType employmentType;

    private BigDecimal salaryMin;

    private BigDecimal salaryMax;

    private String requirements;

    private String benefits;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

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
