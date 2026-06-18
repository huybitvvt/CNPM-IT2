package com.lms.dev.dto;

import com.lms.dev.enums.PaymentStatus;

import java.util.UUID;

public record PaymentResponse(
        UUID paymentId,
        UUID courseId,
        String courseName,
        int amount,
        String paymentCode,
        String bankAccount,
        String bankCode,
        String accountName,
        String transferContent,
        String qrUrl,
        PaymentStatus status
) {
}
