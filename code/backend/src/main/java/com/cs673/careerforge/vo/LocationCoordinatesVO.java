package com.cs673.careerforge.vo;

import lombok.*;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class LocationCoordinatesVO {

    private Double lat;

    private Double lon;

}
