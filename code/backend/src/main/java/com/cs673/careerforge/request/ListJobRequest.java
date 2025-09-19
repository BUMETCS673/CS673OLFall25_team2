package com.cs673.careerforge.request;

import com.cs673.careerforge.common.EmploymentType;
import com.cs673.careerforge.vo.ApplicationTrackingVO;
import com.cs673.careerforge.vo.LocationCoordinatesVO;
import com.cs673.careerforge.vo.UserVO;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ListJobRequest extends BaseRequest {

    private int size;
    private int page;
}
