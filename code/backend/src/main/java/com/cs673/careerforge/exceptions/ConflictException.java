package com.cs673.careerforge.exceptions;
/*

 AI-generated code:  100% (tool: ChatGPT)

 Human code: 0%

 Framework-generated code: 0%

*/

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
