package com.youtubeplanner.backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserRequest {
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @Size(max = 255, message = "显示名称不能超过255个字符")
    private String displayName;
    
    private String role; // USER 或 ADMIN
} 