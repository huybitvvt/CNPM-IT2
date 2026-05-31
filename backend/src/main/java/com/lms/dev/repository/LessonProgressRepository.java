package com.lms.dev.repository;

import com.lms.dev.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {

    @Query("select p from LessonProgress p where p.user.id = :userId and p.lesson.lessonId = :lessonId")
    Optional<LessonProgress> findByUserIdAndLessonId(@Param("userId") UUID userId,
                                                     @Param("lessonId") UUID lessonId);

    @Query("""
            select p from LessonProgress p
            where p.user.id = :userId and p.lesson.course.course_id = :courseId
            """)
    List<LessonProgress> findByUserIdAndCourseId(@Param("userId") UUID userId,
                                                 @Param("courseId") UUID courseId);
}
