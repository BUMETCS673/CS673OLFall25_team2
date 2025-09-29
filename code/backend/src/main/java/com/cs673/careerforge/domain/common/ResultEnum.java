package com.cs673.careerforge.domain.common;

/**
 * Standard result codes and messages.
 * Written by human.
 */
public enum ResultEnum {
    OK(0, "OK", "Request succeeded"),
    BAD_REQUEST(400, "Bad request", "Invalid or missing parameters"),
    UNAUTHORIZED(401, "Unauthorized", "Authentication required or insufficient privileges"),
    FORBIDDEN(403, "Forbidden", "Access to this resource is denied"),
    NOT_FOUND(404, "Not found", "Resource or endpoint not found"),
    BUSINESS_ERROR(1001, "Business failure", "Known business validation failure"),
    INTERNAL_ERROR(500, "Please try again later", "Internal server error");

    private final int code;
    private final String msg;
    private final String description;

    ResultEnum(int code, String msg, String description) {
        this.code = code;
        this.msg = msg;
        this.description = description;
    }

    public int code() {
        return code;
    }

    public String msg() {
        return msg;
    }

    public String description() {
        return description;
    }
}