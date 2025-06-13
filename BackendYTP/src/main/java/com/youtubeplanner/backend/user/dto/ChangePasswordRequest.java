/*
 * 文件名：ChangePasswordRequest.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 修改密码请求DTO，用于接收用户密码修改请求。
 * 包含当前密码和新密码字段。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "当前密码不能为空")
    private String currentPassword;

    @NotBlank(message = "新密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20个字符之间")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]+$",
            message = "密码必须包含至少一个字母和一个数字")
    private String newPassword;
} 