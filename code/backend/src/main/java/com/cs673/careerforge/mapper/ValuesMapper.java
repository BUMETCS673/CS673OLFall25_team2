package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.domain.Values;
import com.cs673.careerforge.utils.DateTimeConvertor;
import com.cs673.careerforge.vo.JobVO;
import com.cs673.careerforge.vo.ValuesVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses =  {UserMapper.class, DateTimeConvertor.class})
public interface ValuesMapper {
    ValuesMapper INSTANCE = Mappers.getMapper(ValuesMapper.class);
    ValuesVO toVO(Values values);
}
