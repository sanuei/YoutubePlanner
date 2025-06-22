package com.youtubeplanner.backend.user.service;

import com.youtubeplanner.backend.common.response.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.user.dto.AdminUserListResponse;
import com.youtubeplanner.backend.user.dto.AdminUpdateUserRequest;

public interface AdminUserService {
    ApiResponse<PageResponse<AdminUserListResponse>> getAllUsers(int page, int limit, String search, String sortBy, String order);
    ApiResponse<AdminUserListResponse> getUserById(Long userId);
    ApiResponse<AdminUserListResponse> updateUser(Long userId, AdminUpdateUserRequest request);
    ApiResponse<Void> deleteUser(Long userId);
    ApiResponse<AdminUserListResponse> updateUserRole(Long userId, String role);
} 