package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.LocationCoordinates;
import com.cs673.careerforge.utils.DateTimeConvertor;
import com.cs673.careerforge.web.vo.LocationCoordinatesVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * Written by human.
 */
@Mapper(componentModel = "spring", uses =  {JobMapper.class, UserMapper.class, DateTimeConvertor.class})
public interface LocationCoordinatesMapper {
    LocationCoordinatesMapper INSTANCE = Mappers.getMapper(LocationCoordinatesMapper.class);
    LocationCoordinatesVO toVO(LocationCoordinates locationCoordinates);
}
