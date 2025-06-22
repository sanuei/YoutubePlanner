/*
 * 文件名：ApiConfigRequest.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * API配置请求DTO，用于接收用户的API配置信息。
 * 包含API提供商、密钥、基础URL和模型等字段。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ApiConfigRequest {
    @Pattern(regexp = "^(openai|claude|custom)$", message = "API提供商必须是 openai、claude 或 custom")
    private String apiProvider;

    private String apiKey;

    private String apiBaseUrl;

    private String apiModel;
} 