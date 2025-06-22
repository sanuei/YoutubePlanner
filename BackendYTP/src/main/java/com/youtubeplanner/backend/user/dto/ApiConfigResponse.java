/*
 * 文件名：ApiConfigResponse.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * API配置响应DTO，用于返回用户的API配置信息。
 * 包含API提供商、基础URL和模型等字段，不包含敏感的API密钥。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ApiConfigResponse {
    private String apiProvider;
    private String apiBaseUrl;
    private String apiModel;
    private boolean hasApiKey; // 是否已配置API密钥，不返回实际密钥
} 