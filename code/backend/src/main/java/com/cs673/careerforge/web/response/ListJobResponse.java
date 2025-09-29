package com.cs673.careerforge.web.response;


import com.cs673.careerforge.web.vo.JobVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * Written by Human.
 */
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ListJobResponse {

    private int page;
    private int size;
    private long total;
    private List<JobVO> jobs;
}
