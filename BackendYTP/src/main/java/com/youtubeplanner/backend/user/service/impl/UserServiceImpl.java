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
import com.youtubeplanner.backend.user.entity.User;
import com.youtubeplanner.backend.user.repository.UserRepository;
import com.youtubeplanner.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetailResponse getCurrentUserInfo(User user) {
        // TODO: 实现获取用户统计信息的逻辑
        UserStats stats = UserStats.builder()
                .totalScripts(0)  // 需要从数据库获取
                .totalChannels(0) // 需要从数据库获取
                .totalCategories(0) // 需要从数据库获取
                .build();

        return UserDetailResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .avatarUrl(user.getAvatarUrl())
                .displayName(user.getDisplayName())
                .stats(stats)
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
} 