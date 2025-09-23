package com.cs673.careerforge.vo;

import lombok.*;


@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BenefitsVO {

    private String title;

    private String benefitsList;

}
