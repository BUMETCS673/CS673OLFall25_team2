package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.ApplicationTracking;
import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.vo.ApplicationTrackingVO;
import com.cs673.careerforge.vo.JobVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {JobMapper.class, UserMapper.class})
public interface ApplicationTrackingMapper {
    ApplicationTrackingMapper INSTANCE = Mappers.getMapper(ApplicationTrackingMapper.class);
    ApplicationTrackingVO toVO(ApplicationTracking applicationTracking);
}
