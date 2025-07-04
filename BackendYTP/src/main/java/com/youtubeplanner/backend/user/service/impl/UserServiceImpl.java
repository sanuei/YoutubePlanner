/*
 * 文件名：UserServiceImpl.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 用户服务实现类，实现用户相关的业务逻辑。
 * 包括获取用户信息、更新用户信息等功能。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.service.impl;

import com.youtubeplanner.backend.user.dto.ChangePasswordRequest;
import com.youtubeplanner.backend.user.dto.UpdateUserRequest;
import com.youtubeplanner.backend.user.dto.UserDetailResponse;
import com.youtubeplanner.backend.user.dto.UserStats;
import com.youtubeplanner.backend.user.dto.ApiConfigRequest;
import com.youtubeplanner.backend.user.dto.ApiConfigResponse;
import com.youtubeplanner.backend.user.entity.User;
import com.youtubeplanner.backend.user.repository.UserRepository;
import com.youtubeplanner.backend.user.service.UserService;
import com.youtubeplanner.backend.script.repository.ScriptRepository;
import com.youtubeplanner.backend.channel.ChannelRepository;
import com.youtubeplanner.backend.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ScriptRepository scriptRepository;
    private final ChannelRepository channelRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public UserDetailResponse getCurrentUserInfo(User user) {
        // 实现获取用户统计信息的逻辑
        UserStats stats = UserStats.builder()
                .totalScripts((int) scriptRepository.countByUserId(user.getUserId()))
                .totalChannels((int) channelRepository.countByUserId(user.getUserId()))
                .totalCategories((int) categoryRepository.countByUserId(user.getUserId()))
                .build();

        return UserDetailResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .avatarUrl(user.getAvatarUrl())
                .displayName(user.getDisplayName())
                .role(user.getRole().name())
                .stats(stats)
                .apiConfig(getApiConfig(user))
                .build();
    }

    @Override
    @Transactional
    public UserDetailResponse updateUserInfo(User user, UpdateUserRequest request) {
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("邮箱已被使用");
            }
            user.setEmail(request.getEmail());
        }

        user = userRepository.save(user);
        return getCurrentUserInfo(user);
    }

    @Override
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("当前密码错误");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public ApiConfigResponse getApiConfig(User user) {
        return ApiConfigResponse.builder()
                .apiProvider(user.getApiProvider())
                .apiBaseUrl(user.getApiBaseUrl())
                .apiModel(user.getApiModel())
                .hasApiKey(user.getApiKey() != null && !user.getApiKey().trim().isEmpty())
                .build();
    }

    @Override
    @Transactional
    public ApiConfigResponse updateApiConfig(User user, ApiConfigRequest request) {
        if (request.getApiProvider() != null) {
            user.setApiProvider(request.getApiProvider());
        }
        if (request.getApiKey() != null) {
            user.setApiKey(request.getApiKey());
        }
        if (request.getApiBaseUrl() != null) {
            user.setApiBaseUrl(request.getApiBaseUrl());
        }
        if (request.getApiModel() != null) {
            user.setApiModel(request.getApiModel());
        }

        userRepository.save(user);
        return getApiConfig(user);
    }

    @Override
    public ApiConfigRequest getFullApiConfig(User user) {
        ApiConfigRequest config = new ApiConfigRequest();
        config.setApiProvider(user.getApiProvider());
        config.setApiKey(user.getApiKey());
        config.setApiBaseUrl(user.getApiBaseUrl());
        config.setApiModel(user.getApiModel());
        return config;
    }
} 