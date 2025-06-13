/*
 * 文件名：UpdateUserRequest.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 更新用户信息请求DTO，用于接收用户信息更新请求。
 * 包含可更新的用户信息字段。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Email(message = "邮箱格式不正确")
    private String email;
} 