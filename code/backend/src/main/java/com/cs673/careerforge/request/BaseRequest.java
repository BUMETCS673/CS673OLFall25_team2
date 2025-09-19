package com.cs673.careerforge.request;

import lombok.*;


@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BaseRequest {
    private int uid;
}
