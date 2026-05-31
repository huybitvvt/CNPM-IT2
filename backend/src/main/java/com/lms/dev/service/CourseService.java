package com.lms.dev.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.dev.entity.Course;
import com.lms.dev.repository.CourseRepository;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        normalizeSeedCourseCopy(courses);
        return courses;
    }

    public Course getCourseById(UUID id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course != null) {
            normalizeSeedCourseCopy(List.of(course));
        }
        return course;
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(UUID id, Course updatedCourse) {
        Course existingCourse = courseRepository.findById(id).orElse(null);
        if (existingCourse != null) {
            existingCourse.setCourse_name(updatedCourse.getCourse_name());
            existingCourse.setDescription(updatedCourse.getDescription());
            existingCourse.setP_link(updatedCourse.getP_link());
            existingCourse.setPrice(updatedCourse.getPrice());
            existingCourse.setInstructor(updatedCourse.getInstructor());
            existingCourse.setCategory(updatedCourse.getCategory());
            existingCourse.setLevel(updatedCourse.getLevel());
            existingCourse.setDurationHours(updatedCourse.getDurationHours());
            existingCourse.setY_link(updatedCourse.getY_link());
            return courseRepository.save(existingCourse);
        }
        return null;
    }

    public void deleteCourse(UUID id) {
        courseRepository.deleteById(id);
    }

    private void normalizeSeedCourseCopy(List<Course> courses) {
        boolean changed = false;

        for (Course course : courses) {
            CourseCopy copy = findSeedCopy(course);
            if (copy == null) {
                continue;
            }

            if (!copy.name().equals(course.getCourse_name())) {
                course.setCourse_name(copy.name());
                changed = true;
            }
            if (!copy.description().equals(course.getDescription())) {
                course.setDescription(copy.description());
                changed = true;
            }
            if (!copy.videoUrl().equals(course.getY_link())) {
                course.setY_link(copy.videoUrl());
                changed = true;
            }
        }

        if (changed) {
            courseRepository.saveAll(courses);
        }
    }

    private CourseCopy findSeedCopy(Course course) {
        String name = course.getCourse_name() == null ? "" : course.getCourse_name().toLowerCase();

        if (name.equals("reactjs tu co ban den du an thuc te") || name.equals("reactjs từ cơ bản đến dự án thực tế")) {
            return new CourseCopy(
                    "ReactJS từ cơ bản đến dự án thực tế",
                    "Học React theo lộ trình thực chiến: component, props, state, hooks, routing, API và xây dựng dashboard quản lý khóa học.",
                    "https://www.youtube.com/watch?v=x0fSBAgBrOQ"
            );
        }
        if (name.equals("spring boot rest api va jwt") || name.equals("spring boot rest api và jwt")) {
            return new CourseCopy(
                    "Spring Boot REST API và JWT",
                    "Xây dựng backend Java với Spring Boot, Spring Data JPA, Spring Security, JWT, Swagger và kết nối PostgreSQL/Supabase.",
                    "https://www.youtube.com/watch?v=MiHVcukru3U"
            );
        }
        if (name.equals("java core cho nguoi moi bat dau") || name.equals("java core cho người mới bắt đầu")) {
            return new CourseCopy(
                    "Java Core cho người mới bắt đầu",
                    "Nắm vững Java Core, OOP, collection, exception, file IO và các nền tảng cần có trước khi học Spring Boot.",
                    "https://www.youtube.com/watch?v=3gtOAlcovoQ"
            );
        }
        if (name.equals("sql va thiet ke co so du lieu") || name.equals("sql và thiết kế cơ sở dữ liệu")) {
            return new CourseCopy(
                    "SQL và thiết kế cơ sở dữ liệu",
                    "Học SQL, ERD, chuẩn hóa dữ liệu, truy vấn nâng cao và thiết kế database cho hệ thống quản lý khóa học.",
                    "https://www.youtube.com/watch?v=2fanjSYVElY"
            );
        }
        if (name.equals("python nen tang va ung dung") || name.equals("python nền tảng và ứng dụng")) {
            return new CourseCopy(
                    "Python nền tảng và ứng dụng",
                    "Làm quen Python, cấu trúc dữ liệu, xử lý file, module và viết các ứng dụng nhỏ phục vụ học tập lập trình.",
                    "https://www.youtube.com/watch?v=NZj6LI5a9vc"
            );
        }
        if (name.equals("devops can ban voi docker va ci/cd") || name.equals("devops căn bản với docker và ci/cd")) {
            return new CourseCopy(
                    "DevOps căn bản với Docker và CI/CD",
                    "Tìm hiểu Docker, container, biến môi trường, pipeline CI/CD và triển khai ứng dụng fullstack lên cloud.",
                    "https://www.youtube.com/watch?v=P1IpryhFeLM"
            );
        }

        return null;
    }

    private record CourseCopy(String name, String description, String videoUrl) {
    }
}
