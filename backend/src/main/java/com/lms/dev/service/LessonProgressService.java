package com.lms.dev.service;

import com.lms.dev.dto.CourseProgressSummaryResponse;
import com.lms.dev.dto.LessonProgressRequest;
import com.lms.dev.dto.LessonProgressResponse;
import com.lms.dev.entity.CourseLesson;
import com.lms.dev.entity.LessonProgress;
import com.lms.dev.entity.User;
import com.lms.dev.repository.CourseLessonRepository;
import com.lms.dev.repository.LessonProgressRepository;
import com.lms.dev.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final CourseLessonRepository courseLessonRepository;
    private final UserRepository userRepository;

    public LessonProgressResponse getLessonProgress(UUID userId, UUID lessonId) {
        return lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                .map(this::toResponse)
                .orElse(new LessonProgressResponse(lessonId, 0, 0, false, 0));
    }

    public CourseProgressSummaryResponse getCourseSummary(UUID userId, UUID courseId) {
        List<CourseLesson> lessons = courseLessonRepository.findByCourseId(courseId);
        Map<UUID, LessonProgress> progressByLesson = lessonProgressRepository
                .findByUserIdAndCourseId(userId, courseId)
                .stream()
                .collect(Collectors.toMap(
                        progress -> progress.getLesson().getLessonId(),
                        progress -> progress
                ));

        List<LessonProgressResponse> lessonResponses = lessons.stream()
                .sorted(Comparator.comparing(CourseLesson::getLessonOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(lesson -> {
                    LessonProgress progress = progressByLesson.get(lesson.getLessonId());
                    return progress == null
                            ? new LessonProgressResponse(lesson.getLessonId(), 0, 0, false, 0)
                            : toResponse(progress);
                })
                .toList();

        int completedLessons = (int) lessonResponses.stream()
                .filter(LessonProgressResponse::completed)
                .count();
        int totalLessons = lessons.size();
        int percent = totalLessons == 0 ? 0 : Math.round((completedLessons * 100f) / totalLessons);

        return new CourseProgressSummaryResponse(courseId, totalLessons, completedLessons, percent, lessonResponses);
    }

    public ResponseEntity<LessonProgressResponse> updateProgress(LessonProgressRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        CourseLesson lesson = courseLessonRepository.findById(request.getLessonId()).orElse(null);

        if (user == null || lesson == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        LessonProgress progress = lessonProgressRepository
                .findByUserIdAndLessonId(request.getUserId(), request.getLessonId())
                .orElseGet(() -> {
                    LessonProgress created = new LessonProgress();
                    created.setUser(user);
                    created.setLesson(lesson);
                    return created;
                });

        float newPlayedTime = Math.max(progress.getPlayedTime(), request.getPlayedTime());
        float newDuration = request.getDuration() > 0 ? request.getDuration() : progress.getDuration();

        progress.setPlayedTime(newPlayedTime);
        progress.setDuration(newDuration);
        progress.setCompleted(calculatePercent(newPlayedTime, newDuration) >= 90);

        LessonProgress saved = lessonProgressRepository.save(progress);
        return ResponseEntity.ok(toResponse(saved));
    }

    private LessonProgressResponse toResponse(LessonProgress progress) {
        return new LessonProgressResponse(
                progress.getLesson().getLessonId(),
                progress.getPlayedTime(),
                progress.getDuration(),
                progress.isCompleted(),
                calculatePercent(progress.getPlayedTime(), progress.getDuration())
        );
    }

    private int calculatePercent(float playedTime, float duration) {
        if (duration <= 0) return 0;
        return Math.min(Math.round((playedTime / duration) * 100), 100);
    }
}
