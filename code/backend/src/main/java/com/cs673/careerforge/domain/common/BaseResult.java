package com.cs673.careerforge.domain.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;

/**
 * Unified outer response wrapper.
 * Always used as the top-level envelope for any controller response.
 * Written by human.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResult<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    /** Whether the overall HTTP request is considered successful (handled). */
    private boolean success;
    /** Error code when success == false. */
    private Integer errorCode;
    /** Error message when success == false. */
    private String errorMsg;
    /** Original business payload (or handled failure object). */
    private T result;

    public static <T> BaseResult<T> ok(T data) {
        BaseResult<T> r = new BaseResult<>();
        r.success = true;
        r.result = data;
        return r;
    }

    public static <T> BaseResult<T> fail(int code, String msg) {
        BaseResult<T> r = new BaseResult<>();
        r.success = false;
        r.errorCode = code;
        r.errorMsg = msg;
        return r;
    }

    // getters/setters
    public boolean isSuccess() { return success; }
    public Integer getErrorCode() { return errorCode; }
    public String getErrorMsg() { return errorMsg; }
    public T getResult() { return result; }
    public void setSuccess(boolean success) { this.success = success; }
    public void setErrorCode(Integer errorCode) { this.errorCode = errorCode; }
    public void setErrorMsg(String errorMsg) { this.errorMsg = errorMsg; }
    public void setResult(T result) { this.result = result; }
}
