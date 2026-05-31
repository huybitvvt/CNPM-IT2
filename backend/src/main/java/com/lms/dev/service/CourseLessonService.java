package com.lms.dev.service;

import com.lms.dev.entity.Course;
import com.lms.dev.entity.CourseLesson;
import com.lms.dev.repository.CourseLessonRepository;
import com.lms.dev.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseLessonService {

    private final CourseLessonRepository courseLessonRepository;
    private final CourseRepository courseRepository;

    public List<CourseLesson> getLessonsByCourse(UUID courseId) {
        return courseLessonRepository.findByCourseId(courseId);
    }

    public CourseLesson createLesson(UUID courseId, CourseLesson lesson) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        lesson.setCourse(course);
        return courseLessonRepository.save(lesson);
    }

    public CourseLesson updateLesson(UUID lessonId, CourseLesson updatedLesson) {
        CourseLesson lesson = courseLessonRepository.findById(lessonId).orElseThrow();
        lesson.setTitle(updatedLesson.getTitle());
        lesson.setDescription(updatedLesson.getDescription());
        lesson.setVideoUrl(updatedLesson.getVideoUrl());
        lesson.setSourceName(updatedLesson.getSourceName());
        lesson.setMaterialUrl(updatedLesson.getMaterialUrl());
        lesson.setSourceCodeUrl(updatedLesson.getSourceCodeUrl());
        lesson.setDurationMinutes(updatedLesson.getDurationMinutes());
        lesson.setLessonOrder(updatedLesson.getLessonOrder());
        return courseLessonRepository.save(lesson);
    }

    public void deleteLesson(UUID lessonId) {
        courseLessonRepository.deleteById(lessonId);
    }
}
