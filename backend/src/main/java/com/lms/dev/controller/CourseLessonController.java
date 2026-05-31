package com.lms.dev.controller;

import com.lms.dev.entity.CourseLesson;
import com.lms.dev.service.CourseLessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseLessonController {

    private final CourseLessonService courseLessonService;

    @GetMapping("/{courseId}/lessons")
    public List<CourseLesson> getLessonsByCourse(@PathVariable UUID courseId) {
        return courseLessonService.getLessonsByCourse(courseId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{courseId}/lessons")
    public CourseLesson createLesson(@PathVariable UUID courseId, @RequestBody CourseLesson lesson) {
        return courseLessonService.createLesson(courseId, lesson);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/lessons/{lessonId}")
    public CourseLesson updateLesson(@PathVariable UUID lessonId, @RequestBody CourseLesson lesson) {
        return courseLessonService.updateLesson(lessonId, lesson);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/lessons/{lessonId}")
    public void deleteLesson(@PathVariable UUID lessonId) {
        courseLessonService.deleteLesson(lessonId);
    }
}
