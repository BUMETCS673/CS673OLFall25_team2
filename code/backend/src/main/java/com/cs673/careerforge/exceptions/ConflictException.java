package com.cs673.careerforge.exceptions;

import java.util.List;

public class ConflictException extends RuntimeException {
    private final List<String> conflicts;

    public ConflictException(String message, List<String> conflicts) {
        super(message);
        this.conflicts = conflicts;
    }

    public List<String> getConflicts() {
        return conflicts;
    }
}
