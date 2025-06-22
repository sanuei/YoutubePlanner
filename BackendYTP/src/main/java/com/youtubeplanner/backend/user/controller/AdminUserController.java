package com.youtubeplanner.backend.user.controller;

import com.youtubeplanner.backend.common.response.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.user.dto.AdminUserListResponse;
import com.youtubeplanner.backend.user.dto.AdminUpdateUserRequest;
import com.youtubeplanner.backend.user.entity.User;
import com.youtubeplanner.backend.user.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<PageResponse<AdminUserListResponse>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order,
            @AuthenticationPrincipal User admin) {
        log.info("获取用户列表请求 - 页码: {}, 每页数量: {}, 搜索: {}, 排序字段: {}, 排序方向: {}", 
                page, limit, search, sortBy, order);
        return adminUserService.getAllUsers(page, limit, search, sortBy, order);
    }

    @GetMapping("/{userId}")
    public ApiResponse<AdminUserListResponse> getUserById(
            @PathVariable Long userId,
            @AuthenticationPrincipal User admin) {
        log.debug("管理员 {} 获取用户详情，用户ID: {}", admin.getUsername(), userId);
        return adminUserService.getUserById(userId);
    }

    @PutMapping("/{userId}")
    public ApiResponse<AdminUserListResponse> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUpdateUserRequest request,
            @AuthenticationPrincipal User admin) {
        log.debug("管理员 {} 更新用户信息，用户ID: {}", admin.getUsername(), userId);
        return adminUserService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<Void> deleteUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal User admin) {
        log.debug("管理员 {} 删除用户，用户ID: {}", admin.getUsername(), userId);
        
        // 防止管理员删除自己
        if (userId.equals(admin.getUserId())) {
            return ApiResponse.error(400, "不能删除自己的账户");
        }
        
        return adminUserService.deleteUser(userId);
    }

    @PutMapping("/{userId}/role")
    public ApiResponse<AdminUserListResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role,
            @AuthenticationPrincipal User admin) {
        log.debug("管理员 {} 更新用户角色，用户ID: {}, 新角色: {}", admin.getUsername(), userId, role);
        
        // 防止管理员修改自己的角色
        if (userId.equals(admin.getUserId())) {
            return ApiResponse.error(400, "不能修改自己的角色");
        }
        
        return adminUserService.updateUserRole(userId, role);
    }
} 