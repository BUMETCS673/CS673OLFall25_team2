package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.utils.DateTimeConvertor;
import com.cs673.careerforge.vo.UserVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * Written by human.
 */
@Mapper(componentModel = "spring", uses = {JobMapper.class, DateTimeConvertor.class})
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserVO toVO(User user);
}
