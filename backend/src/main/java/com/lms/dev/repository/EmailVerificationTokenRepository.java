package com.lms.dev.repository;

import com.lms.dev.entity.EmailVerificationToken;
import com.lms.dev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByUserAndUsedFalse(User user);
}
