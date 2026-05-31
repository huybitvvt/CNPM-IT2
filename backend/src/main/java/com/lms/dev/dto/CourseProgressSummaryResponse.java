package com.lms.dev.dto;

import java.util.List;
import java.util.UUID;

public record CourseProgressSummaryResponse(
        UUID courseId,
        int totalLessons,
        int completedLessons,
        int percent,
        List<LessonProgressResponse> lessons
) {
}
