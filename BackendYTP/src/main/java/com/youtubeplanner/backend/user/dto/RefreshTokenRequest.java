/*
 * 文件名：RefreshTokenRequest.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 刷新令牌请求DTO，用于接收刷新令牌请求。
 * 包含刷新令牌字段。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "刷新令牌不能为空")
    private String refreshToken;
} 