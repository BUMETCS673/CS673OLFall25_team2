package com.cs673.careerforge.mapper;

import com.cs673.careerforge.domain.Benefits;
import com.cs673.careerforge.utils.DateTimeConvertor;
import com.cs673.careerforge.web.vo.BenefitsVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * Written by human.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class, DateTimeConvertor.class})
public interface BenefitsMapper {
    BenefitsMapper INSTANCE = Mappers.getMapper(BenefitsMapper.class);
    BenefitsVO toVO(Benefits benefits);
}
