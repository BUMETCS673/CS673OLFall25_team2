package com.cs673.careerforge.exceptions;

import com.cs673.careerforge.common.ResultEnum;

import java.io.Serializable;

/**
 * Written by human.
 */
public class InvalidParamException extends BizException implements Serializable {
    private static final long serialVersionUID = 1L;

    public InvalidParamException(String message) {
        super(ResultEnum.BAD_REQUEST, message);
    }

    public InvalidParamException(ResultEnum e) {
        super(e);
    }

    public InvalidParamException(ResultEnum e, String extraMsg) {
        super(e, extraMsg);
    }
}
