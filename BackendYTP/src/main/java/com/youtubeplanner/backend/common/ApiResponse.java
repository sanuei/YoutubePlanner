/*
 * File: ApiResponse.java
 * Created Date: 2024-03-19
 * Author: [Your Name]
 * Description: 统一API响应格式封装类，用于标准化所有API的返回格式
 * -----
 * Last Modified: 2024-03-19
 * Modified By: [Your Name]
 * -----
 * Copyright (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private int code;
    private String message;
    private T data;
    private List<ValidationError> errors;
    private Instant timestamp;
    
    @JsonProperty("request_id")
    private String requestId;

    public ApiResponse() {
        this.timestamp = Instant.now();
        this.requestId = UUID.randomUUID().toString();
    }

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.code = 200;
        response.message = "操作成功";
        response.data = data;
        return response;
    }

    public static <T> ApiResponse<T> success(int code, String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.code = code;
        response.message = message;
        response.data = data;
        return response;
    }

    public static <T> ApiResponse<T> created(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.code = 201;
        response.message = "创建成功";
        response.data = data;
        return response;
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.code = code;
        response.message = message;
        return response;
    }

    public static <T> ApiResponse<T> error(int code, String message, List<ValidationError> errors) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.code = code;
        response.message = message;
        response.errors = errors;
        return response;
    }

    public static <T> ApiResponse<T> validationError(List<ValidationError> errors) {
        return new ApiResponse<T>()
                .setSuccess(false)
                .setCode(400)
                .setMessage("请求参数错误")
                .setErrors(errors);
    }

    @Data
    public static class ValidationError {
        private String field;
        private String message;

        public ValidationError(String field, String message) {
            this.field = field;
            this.message = message;
        }
    }
} 