/*
 * 文件名：ApiResponse.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * API响应封装类，用于统一处理API响应格式。
 * 包含成功状态、状态码、消息、数据等字段。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.common.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ApiResponse<T> {
    private boolean success;
    private int code;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private String requestId;

    private ApiResponse() {
        this.timestamp = LocalDateTime.now();
        this.requestId = UUID.randomUUID().toString();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(200, "操作成功", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return success(200, message, data);
    }

    public static <T> ApiResponse<T> success(int code, String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setCode(code);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
} 