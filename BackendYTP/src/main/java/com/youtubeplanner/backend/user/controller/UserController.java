/*
 * 文件名：UserController.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 用户控制器，处理用户相关的HTTP请求。
 * 包括获取用户信息、更新用户信息等接口。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.controller;

import com.youtubeplanner.backend.common.response.ApiResponse;
import com.youtubeplanner.backend.user.dto.ChangePasswordRequest;
import com.youtubeplanner.backend.user.dto.UpdateUserRequest;
import com.youtubeplanner.backend.user.dto.UserDetailResponse;
import com.youtubeplanner.backend.user.entity.User;
import com.youtubeplanner.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserDetailResponse> getCurrentUserInfo(@AuthenticationPrincipal User user) {
        log.debug("获取当前用户信息，用户ID: {}", user != null ? user.getUserId() : "null");
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        UserDetailResponse userInfo = userService.getCurrentUserInfo(user);
        return ApiResponse.success(userInfo);
    }

    @PutMapping("/me")
    public ApiResponse<UserDetailResponse> updateUserInfo(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateUserRequest request) {
        log.debug("更新用户信息，用户ID: {}", user != null ? user.getUserId() : "null");
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        UserDetailResponse userInfo = userService.updateUserInfo(user, request);
        return ApiResponse.success("用户信息更新成功", userInfo);
    }

    @PutMapping("/me/password")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        log.debug("修改密码，用户ID: {}", user != null ? user.getUserId() : "null");
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        userService.changePassword(user, request);
        return ApiResponse.success("密码修改成功", null);
    }
} 