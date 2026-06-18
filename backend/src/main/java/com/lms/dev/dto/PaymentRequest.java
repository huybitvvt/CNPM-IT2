package com.lms.dev.dto;

import java.util.UUID;

public record PaymentRequest(UUID userId, UUID courseId) {
}
