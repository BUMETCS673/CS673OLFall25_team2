package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.LocationCoordinates;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.vo.LocationCoordinatesVO;
import com.cs673.careerforge.vo.UserVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses =  {JobMapper.class, UserMapper.class})
public interface LocationCoordinatesMapper {
    LocationCoordinatesMapper INSTANCE = Mappers.getMapper(LocationCoordinatesMapper.class);
    LocationCoordinatesVO toVO(LocationCoordinates locationCoordinates);
}
