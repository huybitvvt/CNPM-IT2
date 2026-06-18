package com.lms.dev.repository;

import com.lms.dev.entity.Course;
import com.lms.dev.entity.CoursePayment;
import com.lms.dev.entity.User;
import com.lms.dev.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CoursePaymentRepository extends JpaRepository<CoursePayment, UUID> {

    Optional<CoursePayment> findByPaymentCode(String paymentCode);

    Optional<CoursePayment> findFirstByUserAndCourseAndStatusOrderByCreatedAtDesc(User user, Course course, PaymentStatus status);
}
