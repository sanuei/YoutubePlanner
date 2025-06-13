/*
 * 文件名：TokenResponse.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 令牌响应DTO，用于返回JWT令牌相关信息。
 * 包含访问令牌、刷新令牌、令牌类型和过期时间。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfo user;
} 