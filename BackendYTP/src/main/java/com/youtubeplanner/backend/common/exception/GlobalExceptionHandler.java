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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常（RuntimeException）
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException e) {
        System.out.println("业务异常: " + e.getMessage());
        
        // 根据异常消息判断具体的错误类型
        String message = e.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        int code = 500;
        
        if (message != null) {
            if (message.contains("用户名已存在") || message.contains("邮箱已存在")) {
                status = HttpStatus.CONFLICT;
                code = 409;
            } else if (message.contains("用户不存在") || message.contains("用户未认证")) {
                status = HttpStatus.UNAUTHORIZED;
                code = 401;
            } else if (message.contains("无效的") || message.contains("令牌")) {
                status = HttpStatus.UNAUTHORIZED;
                code = 401;
            }
        }
        
        return ResponseEntity.status(status)
                .body(ApiResponse.error(code, message != null ? message : "系统内部错误"));
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        System.out.println("参数验证异常: " + e.getMessage());
        
        List<ApiResponse.ValidationError> errors = new ArrayList<>();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            errors.add(new ApiResponse.ValidationError(fieldError.getField(), fieldError.getDefaultMessage()));
        }
        
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(400, "请求参数验证失败", errors));
    }

    /**
     * 处理认证异常
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(BadCredentialsException e) {
        System.out.println("认证异常: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(401, "用户名或密码错误"));
    }

    /**
     * 处理其他未捕获的异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception e) {
        System.out.println("未处理的异常: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "系统内部错误，请稍后重试"));
    }
} 