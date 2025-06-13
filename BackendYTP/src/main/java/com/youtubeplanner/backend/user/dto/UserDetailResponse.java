/*
 * 文件名：UserDetailResponse.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 用户详细信息响应DTO，用于返回用户的完整信息。
 * 包含用户基本信息、统计数据和创建时间等。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class UserDetailResponse {
    private Long userId;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String avatarUrl;
    private String displayName;
    private UserStats stats;
} 