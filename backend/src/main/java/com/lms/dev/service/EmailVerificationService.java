package com.lms.dev.service;

import com.lms.dev.entity.EmailVerificationToken;
import com.lms.dev.entity.User;
import com.lms.dev.repository.EmailVerificationTokenRepository;
import com.lms.dev.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.email-verification.expiration-minutes:1440}")
    private long expirationMinutes;

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String mailFrom;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Transactional
    public void sendVerificationEmail(User user) {
        ensureMailConfigured();
        tokenRepository.deleteByUserAndUsedFalse(user);

        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID() + "-" + UUID.randomUUID());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        tokenRepository.save(token);

        String verifyLink = frontendUrl.replaceAll("/+$", "") + "/verify-email?token=" + token.getToken();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("Xac thuc tai khoan CodePath LMS");
        message.setText("""
                Xin chao %s,

                Vui long mo lien ket sau de xac thuc tai khoan CodePath LMS:

                %s

                Lien ket co hieu luc trong %d phut. Neu ban khong dang ky tai khoan nay, hay bo qua email nay.

                CodePath LMS
                """.formatted(user.getUsername(), verifyLink, expirationMinutes));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.warn("Failed to send verification email to {}", user.getEmail(), ex);
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Chưa gửi được email xác thực. Vui lòng kiểm tra cấu hình SMTP."
            );
        }
    }

    @Transactional
    public User verifyEmail(String tokenValue) {
        if (tokenValue == null || tokenValue.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token xác thực không hợp lệ.");
        }

        EmailVerificationToken token = tokenRepository.findByToken(tokenValue.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Link xác thực không hợp lệ."));

        if (token.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Link xác thực đã được sử dụng.");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Link xác thực đã hết hạn.");
        }

        User user = token.getUser();
        user.setIsActive(true);
        token.setUsed(true);
        token.setUsedAt(LocalDateTime.now());
        userRepository.save(user);
        tokenRepository.save(token);
        return user;
    }

    private void ensureMailConfigured() {
        if (mailHost == null || mailHost.isBlank() || mailFrom == null || mailFrom.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Chưa cấu hình SMTP để gửi email xác thực."
            );
        }
    }
}
