package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.Benefits;
import com.cs673.careerforge.domain.Job;
import com.cs673.careerforge.vo.BenefitsVO;
import com.cs673.careerforge.vo.JobVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface BenefitsMapper {
    BenefitsMapper INSTANCE = Mappers.getMapper(BenefitsMapper.class);
    BenefitsVO toVO(Benefits benefits);
}
