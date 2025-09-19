package com.cs673.careerforge.response;

import com.cs673.careerforge.vo.JobVO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ListJobResponse {

    private int total;

    private int size;

    private int offset;

    private List<JobVO> jobs;
}
