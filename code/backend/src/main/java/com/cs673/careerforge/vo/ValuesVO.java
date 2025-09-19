package com.cs673.careerforge.vo;

import lombok.*;


@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ValuesVO {

    private String title;

    private String valuesList;

}
