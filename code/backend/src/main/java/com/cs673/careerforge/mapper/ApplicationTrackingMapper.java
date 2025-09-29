package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.ApplicationTracking;
import com.cs673.careerforge.utils.DateTimeConvertor;
import com.cs673.careerforge.web.vo.ApplicationTrackingVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * Written by human.
 */

@Mapper(componentModel = "spring", uses = {JobMapper.class, UserMapper.class, DateTimeConvertor.class})
public interface ApplicationTrackingMapper {
    ApplicationTrackingMapper INSTANCE = Mappers.getMapper(ApplicationTrackingMapper.class);
    ApplicationTrackingVO toVO(ApplicationTracking applicationTracking);
}
