package com.lms.dev.service;

import com.lms.dev.dto.PaymentResponse;
import com.lms.dev.entity.Course;
import com.lms.dev.entity.CoursePayment;
import com.lms.dev.entity.User;
import com.lms.dev.enums.PaymentStatus;
import com.lms.dev.repository.CoursePaymentRepository;
import com.lms.dev.repository.CourseRepository;
import com.lms.dev.repository.LearningRepository;
import com.lms.dev.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final String QR_TEMPLATE = "https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s";

    private final CoursePaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LearningRepository learningRepository;
    private final LearningService learningService;

    @Value("${app.payment.course-price-vnd:2000}")
    private int coursePrice;

    @Value("${app.payment.bank-account:}")
    private String bankAccount;

    @Value("${app.payment.bank-code:}")
    private String bankCode;

    @Value("${app.payment.account-name:}")
    private String accountName;

    @Value("${app.payment.sepay-webhook-api-key:}")
    private String sepayWebhookApiKey;

    @Transactional
    public PaymentResponse createCoursePayment(UUID userId, UUID courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng."));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khóa học."));

        if (learningRepository.findByUserAndCourse(user, course) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã đăng ký khóa học này.");
        }

        Optional<CoursePayment> existingPayment = paymentRepository
                .findFirstByUserAndCourseAndStatusOrderByCreatedAtDesc(user, course, PaymentStatus.PENDING);
        CoursePayment payment = existingPayment.orElseGet(() -> {
            CoursePayment next = new CoursePayment();
            next.setUser(user);
            next.setCourse(course);
            next.setAmount(coursePrice);
            next.setPaymentCode(generatePaymentCode());
            next.setStatus(PaymentStatus.PENDING);
            return paymentRepository.save(next);
        });

        return toResponse(payment);
    }

    @Transactional
    public PaymentResponse getPayment(UUID paymentId) {
        CoursePayment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn thanh toán."));
        return toResponse(payment);
    }

    @Transactional
    public boolean confirmSepayPayment(Map<String, Object> payload, String authorizationHeader) {
        validateSepayAuthorization(authorizationHeader);

        String content = stringValue(payload, "content");
        String code = stringValue(payload, "code");
        int amount = intValue(payload, "transferAmount", "amount");
        String transferType = stringValue(payload, "transferType");
        String transactionId = firstNonBlank(
                stringValue(payload, "id"),
                stringValue(payload, "referenceCode"),
                stringValue(payload, "transactionId")
        );

        if (amount < coursePrice || ("out".equalsIgnoreCase(transferType))) {
            return false;
        }

        String paymentCode = findPaymentCode(code, content);
        if (paymentCode == null) {
            return false;
        }

        CoursePayment payment = paymentRepository.findByPaymentCode(paymentCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mã thanh toán."));

        if (payment.getStatus() == PaymentStatus.PAID) {
            return true;
        }
        if (payment.getAmount() != amount) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số tiền chuyển khoản không khớp đơn thanh toán.");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setSepayTransactionId(transactionId);
        paymentRepository.save(payment);
        learningService.enrollCourse(payment.getUser(), payment.getCourse());
        return true;
    }

    private PaymentResponse toResponse(CoursePayment payment) {
        String transferContent = payment.getPaymentCode();
        String qrUrl = QR_TEMPLATE.formatted(
                encodePath(bankCode),
                encodePath(bankAccount),
                payment.getAmount(),
                encodeQuery(transferContent),
                encodeQuery(accountName)
        );

        Course course = payment.getCourse();
        return new PaymentResponse(
                payment.getId(),
                course.getCourse_id(),
                course.getCourse_name(),
                payment.getAmount(),
                payment.getPaymentCode(),
                bankAccount,
                bankCode,
                accountName,
                transferContent,
                qrUrl,
                payment.getStatus()
        );
    }

    private String generatePaymentCode() {
        String token = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase(Locale.ROOT);
        return "LMS" + token;
    }

    private void validateSepayAuthorization(String authorizationHeader) {
        if (sepayWebhookApiKey == null || sepayWebhookApiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Chưa cấu hình API Key webhook SePay.");
        }

        String expected = "Apikey " + sepayWebhookApiKey.trim();
        if (authorizationHeader == null || !authorizationHeader.trim().equals(expected)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Webhook SePay không hợp lệ.");
        }
    }

    private String findPaymentCode(String code, String content) {
        String directCode = normalizeCode(code);
        if (directCode != null) {
            return directCode;
        }

        String normalizedContent = content == null ? "" : content.toUpperCase(Locale.ROOT);
        int index = normalizedContent.indexOf("LMS");
        if (index < 0) {
            return null;
        }

        StringBuilder builder = new StringBuilder();
        for (int i = index; i < normalizedContent.length(); i++) {
            char c = normalizedContent.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                builder.append(c);
            } else if (builder.length() > 0) {
                break;
            }
        }

        return normalizeCode(builder.toString());
    }

    private String normalizeCode(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        return normalized.startsWith("LMS") ? normalized : null;
    }

    private int intValue(Map<String, Object> payload, String... keys) {
        for (String key : keys) {
            Object value = payload.get(key);
            if (value instanceof Number number) {
                return number.intValue();
            }
            if (value instanceof String string && !string.isBlank()) {
                try {
                    return (int) Math.round(Double.parseDouble(string));
                } catch (NumberFormatException ignored) {
                    // Continue to next key.
                }
            }
        }
        return 0;
    }

    private String stringValue(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        return value == null ? null : String.valueOf(value);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private String encodeQuery(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    private String encodePath(String value) {
        return value == null ? "" : value.trim();
    }
}
