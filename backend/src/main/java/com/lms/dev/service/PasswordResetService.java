package com.lms.dev.service;

import com.lms.dev.entity.PasswordResetToken;
import com.lms.dev.entity.User;
import com.lms.dev.repository.PasswordResetTokenRepository;
import com.lms.dev.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.password-reset.expiration-minutes:30}")
    private long expirationMinutes;

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String mailFrom;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Transactional
    public void requestReset(String rawEmail) {
        String email = normalizeEmail(rawEmail);
        if (email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập email.");
        }

        ensureMailConfigured();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            log.info("Password reset requested for non-existing email: {}", email);
            return;
        }

        tokenRepository.deleteByUserAndUsedFalse(user);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(UUID.randomUUID() + "-" + UUID.randomUUID());
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        tokenRepository.save(resetToken);

        sendResetEmail(user, resetToken.getToken());
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token reset mật khẩu không hợp lệ.");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới phải có ít nhất 6 ký tự.");
        }

        PasswordResetToken resetToken = tokenRepository.findByToken(token.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Link đặt lại mật khẩu không hợp lệ."));

        if (resetToken.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Link đặt lại mật khẩu đã được sử dụng.");
        }
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Link đặt lại mật khẩu đã hết hạn.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        resetToken.setUsed(true);
        resetToken.setUsedAt(LocalDateTime.now());
        userRepository.save(user);
        tokenRepository.save(resetToken);
    }

    private void sendResetEmail(User user, String token) {
        String resetLink = frontendUrl.replaceAll("/+$", "") + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("Dat lai mat khau CodePath LMS");
        message.setText("""
                Xin chao %s,

                Ban vua yeu cau dat lai mat khau cho tai khoan CodePath LMS.
                Vui long mo lien ket sau de tao mat khau moi:

                %s

                Lien ket co hieu luc trong %d phut. Neu ban khong yeu cau, hay bo qua email nay.

                CodePath LMS
                """.formatted(user.getUsername(), resetLink, expirationMinutes));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.warn("Failed to send password reset email to {}", user.getEmail(), ex);
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Chưa gửi được email reset mật khẩu. Vui lòng kiểm tra cấu hình SMTP."
            );
        }
    }

    private void ensureMailConfigured() {
        if (mailHost == null || mailHost.isBlank() || mailFrom == null || mailFrom.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Chưa cấu hình SMTP để gửi email reset mật khẩu."
            );
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
