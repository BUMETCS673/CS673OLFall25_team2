package com.cs673.careerforge.exceptions;

import com.cs673.careerforge.common.ResultEnum;

import java.io.Serializable;

/**
 * Business exception that carries a ResultEnum.
 * Written by human.
 */
public class BizException extends RuntimeException implements Serializable {
    private static final long serialVersionUID = 1L;
    private final ResultEnum resultEnum;

    public BizException(ResultEnum e) {
        super(e.msg());
        this.resultEnum = e;
    }

    public BizException(ResultEnum e, String extraMsg) {
        super(extraMsg == null ? e.msg() : extraMsg);
        this.resultEnum = e;
    }

    public ResultEnum getResultEnum() {
        return resultEnum;
    }
}