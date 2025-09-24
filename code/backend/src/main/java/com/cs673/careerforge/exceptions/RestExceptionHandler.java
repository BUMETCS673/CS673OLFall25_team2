package com.cs673.careerforge.exceptions;
/*

 AI-generated code:  100% (tool: ChatGPT)

 Human code: 0%

 Framework-generated code: 0%

*/
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.*;

@RestControllerAdvice
public class RestExceptionHandler {

    // 400: Bean validation errors from @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> fieldErrors = new ArrayList<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            Map<String, String> item = new LinkedHashMap<>();
            item.put("field", fe.getField());
            item.put("code", fe.getCode());       // e.g., NotBlank, Size, Email
            item.put("message", fe.getDefaultMessage());
            fieldErrors.add(item);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", "Validation failed");
        body.put("fieldErrors", fieldErrors);

        return ResponseEntity.badRequest().body(body);
    }

    // Optional: direct ConstraintViolationException (path params, etc.)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        List<Map<String, String>> fieldErrors = ex.getConstraintViolations().stream().map(cv -> {
            Map<String, String> item = new LinkedHashMap<>();
            item.put("field", cv.getPropertyPath().toString());
            item.put("code", cv.getConstraintDescriptor().getAnnotation().annotationType().getSimpleName());
            item.put("message", cv.getMessage());
            return item;
        }).toList();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", "Validation failed");
        body.put("fieldErrors", fieldErrors);

        return ResponseEntity.badRequest().body(body);
    }

    // 409: our explicit conflict
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", "Conflict");
        body.put("message", ex.getMessage());
        body.put("conflicts", ex.getConflicts()); // ["username", "email"]
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // Safety net: DB unique constraint exploded somewhere else
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        // Try to guess which field from the DB error, fall back to generic
        List<String> conflicts = new ArrayList<>();
        String msg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        if (msg != null) {
            String low = msg.toLowerCase(Locale.ROOT);
            if (low.contains("username")) conflicts.add("username");
            if (low.contains("email")) conflicts.add("email");
        }
        if (conflicts.isEmpty()) conflicts = List.of("unknown");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", "Conflict");
        body.put("message", "Unique constraint violation");
        body.put("conflicts", conflicts);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }
}
