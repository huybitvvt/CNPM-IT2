package com.lms.dev.dto;

import com.lms.dev.enums.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String username,
        String email,
        String mobileNumber,
        UserRole role,
        Boolean isActive,
        String dob,
        String gender,
        String location,
        String profession,
        String linkedin_url,
        String github_url,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
