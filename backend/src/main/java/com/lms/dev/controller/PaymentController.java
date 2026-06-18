package com.lms.dev.controller;

import com.lms.dev.dto.ApiResponse;
import com.lms.dev.dto.PaymentRequest;
import com.lms.dev.dto.PaymentResponse;
import com.lms.dev.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/course")
    public ResponseEntity<ApiResponse<PaymentResponse>> createCoursePayment(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createCoursePayment(request.userId(), request.courseId());
        return ResponseEntity.ok(new ApiResponse<>("Đã tạo mã thanh toán khóa học.", response));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable UUID paymentId) {
        PaymentResponse response = paymentService.getPayment(paymentId);
        return ResponseEntity.ok(new ApiResponse<>("Trạng thái thanh toán.", response));
    }

    @PostMapping("/sepay-webhook")
    public ResponseEntity<Map<String, Object>> sepayWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        boolean success = paymentService.confirmSepayPayment(payload, authorizationHeader);
        return ResponseEntity.ok(Map.of("success", success));
    }
}
