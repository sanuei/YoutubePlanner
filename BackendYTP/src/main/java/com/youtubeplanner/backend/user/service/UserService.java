/*
 * 文件名：UserService.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 用户服务接口，定义用户相关的业务方法。
 * 包括获取用户信息、更新用户信息等功能。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.service;

import com.youtubeplanner.backend.user.dto.ChangePasswordRequest;
import com.youtubeplanner.backend.user.dto.UpdateUserRequest;
import com.youtubeplanner.backend.user.dto.UserDetailResponse;
import com.youtubeplanner.backend.user.dto.ApiConfigRequest;
import com.youtubeplanner.backend.user.dto.ApiConfigResponse;
import com.youtubeplanner.backend.user.entity.User;

public interface UserService {
    UserDetailResponse getCurrentUserInfo(User user);
    UserDetailResponse updateUserInfo(User user, UpdateUserRequest request);
    void changePassword(User user, ChangePasswordRequest request);
    ApiConfigResponse updateApiConfig(User user, ApiConfigRequest request);
    ApiConfigResponse getApiConfig(User user);
    ApiConfigRequest getFullApiConfig(User user);
} 