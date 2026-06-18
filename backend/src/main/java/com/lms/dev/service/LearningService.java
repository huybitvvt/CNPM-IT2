package com.lms.dev.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lms.dev.dto.EnrollRequest;
import com.lms.dev.entity.Course;
import com.lms.dev.entity.Learning;
import com.lms.dev.entity.Progress;
import com.lms.dev.entity.User;
import com.lms.dev.repository.CourseRepository;
import com.lms.dev.repository.LearningRepository;
import com.lms.dev.repository.ProgressRepository;
import com.lms.dev.repository.UserRepository;
import java.util.*;

@RequiredArgsConstructor
@Service
public class LearningService {

    private final LearningRepository learningRepository;

    private final UserRepository userRepository;

    private final CourseRepository courseRepository;
    
    private final ProgressRepository progressRepository;

    public List<Course> getLearningCourses(UUID userId) {
        return learningRepository.findCoursesByUserId(userId);
    }
    
    public List<Learning> getEnrollments() {
    	return learningRepository.findAll();
    }

    public String enrollCourse(EnrollRequest enrollRequest) {
        User user = userRepository.findById(enrollRequest.getUserId()).orElse(null);
        Course course = courseRepository.findById(enrollRequest.getCourseId()).orElse(null);

        if (user != null && course != null) {
            return enrollCourse(user, course);
        }

        return "Failed to enroll";
    }

    public String enrollCourse(User user, Course course) {
        Learning existingLearning = learningRepository.findByUserAndCourse(user, course);
        if (existingLearning != null) {
            return "Course already enrolled";
        }

        Progress progress = new Progress();
        progress.setUser(user);
        progress.setCourse(course);
        progressRepository.save(progress);

        Learning learning = new Learning();
        learning.setUser(user);
        learning.setCourse(course);
        learningRepository.save(learning);

        return "Enrolled successfully";
    }


    public void unenrollCourse(UUID id) {
        learningRepository.deleteById(id);
    }
}

