package com.cs673.careerforge.vo;

import com.cs673.careerforge.common.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserVO {

    private Long id;

    private String username;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private UserType userType;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Boolean isActive = true;

    private String companyName;

    private String photo;

    private String rating;

    private String sector;

    private String funding;

    private Integer teamSize;

    private String evaluatedSize;

    private Boolean isClaimed = false;

    private String slug;

    private String locationAddress;

    private LocationCoordinatesVO locationCoordinates;

    private BenefitsVO benefits;

    private ValuesVO values;

    private String badges;

    private List<JobVO> postedJobs;

    private List<ApplicationTrackingVO> applications;

}
