package com.lms.dev.dto;

import java.util.UUID;

public record LessonProgressResponse(
        UUID lessonId,
        float playedTime,
        float duration,
        boolean completed,
        int percent
) {
}
