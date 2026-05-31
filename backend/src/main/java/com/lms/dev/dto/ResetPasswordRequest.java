package com.lms.dev.dto;

public record ResetPasswordRequest(String token, String newPassword) {
}
