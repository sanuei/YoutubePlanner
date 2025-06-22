/*
 * 文件名：GlobalExceptionHandler.java
 * 创建日期：2024年3月19日
 * 作者：YoutubePlanner Team
 * 
 * 文件描述：
 * 全局异常处理器，统一处理应用程序中的各种异常。
 * 包括业务异常、验证异常、认证异常等。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.common.exception;

import com.youtubeplanner.backend.common.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理业务异常（RuntimeException）
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException e) {
        log.error("业务异常: {}", e.getMessage(), e);
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(400, e.getMessage()));
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException e) {
        log.error("参数验证异常: {}", e.getMessage(), e);
        
        // 收集所有验证错误信息
        StringBuilder errorMessage = new StringBuilder();
        e.getBindingResult().getFieldErrors().forEach(error -> {
            if (errorMessage.length() > 0) {
                errorMessage.append("; ");
            }
            errorMessage.append(error.getField()).append(": ").append(error.getDefaultMessage());
        });

        return ResponseEntity.badRequest()
                .body(ApiResponse.error(400, "参数验证失败: " + errorMessage.toString()));
    }

    /**
     * 处理认证异常
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException e) {
        log.error("认证异常: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(401, "认证失败"));
    }

    /**
     * 处理所有未捕获的异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception e) {
        log.error("未处理的异常: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "服务器内部错误"));
    }
} 