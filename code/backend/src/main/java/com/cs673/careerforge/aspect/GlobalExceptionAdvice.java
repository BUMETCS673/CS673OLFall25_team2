package com.cs673.careerforge.aspect;

import com.cs673.careerforge.common.BaseResult;
import com.cs673.careerforge.common.ResultEnum;
import com.cs673.careerforge.exceptions.BizException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Global exception mapping:
 * - BizException: use enum code/message
 * - Other exceptions: 500 / "Please try again later"
 * Also marks a request attribute so ResponseBodyAdvice won't wrap again.
 * Written by human.
 */
@RestControllerAdvice
public class GlobalExceptionAdvice {

    private static final String EX_FLAG = "EX_FROM_HANDLER";

    @ExceptionHandler(BizException.class)
    public BaseResult<Void> handleBiz(BizException e) {
        markException();
        return BaseResult.fail(e.getResultEnum().code(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public BaseResult<Void> handleOther(Exception e) {
        markException();
        return BaseResult.fail(ResultEnum.INTERNAL_ERROR.code(), ResultEnum.INTERNAL_ERROR.msg());
    }

    private void markException() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            attrs.getRequest().setAttribute(EX_FLAG, Boolean.TRUE);
        }
    }
}