package com.lms.dev.repository;

import com.lms.dev.entity.CourseLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CourseLessonRepository extends JpaRepository<CourseLesson, UUID> {

    @Query("select l from CourseLesson l where l.course.course_id = :courseId order by l.lessonOrder asc")
    List<CourseLesson> findByCourseId(@Param("courseId") UUID courseId);

    @Query("select count(l) from CourseLesson l where l.course.course_id = :courseId")
    long countByCourseId(@Param("courseId") UUID courseId);
}
