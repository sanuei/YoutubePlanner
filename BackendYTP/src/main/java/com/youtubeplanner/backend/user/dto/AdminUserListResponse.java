package com.youtubeplanner.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserListResponse {
    private Long userId;
    private String username;
    private String email;
    private String displayName;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserStats stats;
} 