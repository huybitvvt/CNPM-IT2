package com.lms.dev.controller;

import com.lms.dev.dto.CourseProgressSummaryResponse;
import com.lms.dev.dto.LessonProgressRequest;
import com.lms.dev.dto.LessonProgressResponse;
import com.lms.dev.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/lesson-progress")
@RequiredArgsConstructor
public class LessonProgressController {

    private final LessonProgressService lessonProgressService;

    @GetMapping("/{userId}/{lessonId}")
    public LessonProgressResponse getLessonProgress(@PathVariable UUID userId,
                                                    @PathVariable UUID lessonId) {
        return lessonProgressService.getLessonProgress(userId, lessonId);
    }

    @GetMapping("/{userId}/course/{courseId}/summary")
    public CourseProgressSummaryResponse getCourseSummary(@PathVariable UUID userId,
                                                          @PathVariable UUID courseId) {
        return lessonProgressService.getCourseSummary(userId, courseId);
    }

    @PutMapping("/update")
    public ResponseEntity<LessonProgressResponse> updateLessonProgress(@RequestBody LessonProgressRequest request) {
        return lessonProgressService.updateProgress(request);
    }
}
