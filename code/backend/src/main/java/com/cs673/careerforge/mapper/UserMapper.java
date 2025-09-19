package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.vo.JobVO;
import com.cs673.careerforge.vo.UserVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {JobMapper.class})
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    UserVO toVO(User user);
}
