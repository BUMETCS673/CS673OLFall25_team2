package com.cs673.careerforge.domain.common;

/**
 * Standard result codes and messages.
 * Written by human.
 */
public enum ResultEnum {
    OK(200, "OK", "Request succeeded"),
    CREATED(201, "Created", "Request succeeded"),
    BAD_REQUEST(400, "Bad request", "Invalid request"),
    UNAUTHORIZED(401, "Unauthorized", "Authentication/Privilege required"),
    FORBIDDEN(403, "Forbidden", "Access to this resource is denied"),
    NOT_FOUND(404, "Not found", "Resource or endpoint not found"),
    CONFLICT(409, "Resource you are creating already exists", "Already exists"),
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