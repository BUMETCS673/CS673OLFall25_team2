package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.utils.DateTimeConvertor;
import com.cs673.careerforge.vo.JobVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {DateTimeConvertor.class})
public interface JobMapper {
    JobMapper INSTANCE = Mappers.getMapper(JobMapper.class);
    JobVO toVO(Job job);
}
