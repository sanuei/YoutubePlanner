/*
 * 文件名：AuthServiceImpl.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 认证服务实现类，实现用户认证相关的业务逻辑。
 * 包括注册、登录、刷新令牌和登出功能。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.service.impl;

import com.youtubeplanner.backend.user.dto.*;
import com.youtubeplanner.backend.user.entity.User;
import com.youtubeplanner.backend.user.entity.Role;
import com.youtubeplanner.backend.user.repository.UserRepository;
import com.youtubeplanner.backend.user.service.AuthService;
import com.youtubeplanner.backend.user.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public UserInfo register(RegisterRequest request) {
        // 检查用户名和邮箱是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(Role.USER);

        user = userRepository.save(user);

        return UserInfo.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .build();
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        // 验证用户名和密码
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 获取用户信息
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 生成令牌
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600L)
                .user(UserInfo.builder()
                        .userId(user.getUserId())
                        .username(user.getUsername())
                        .build())
                .build();
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        // 验证刷新令牌
        if (!jwtService.validateToken(refreshToken)) {
            throw new RuntimeException("无效的刷新令牌");
        }

        // 从令牌中获取用户信息
        String username = jwtService.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 生成新的访问令牌
        String newAccessToken = jwtService.generateAccessToken(user);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .expiresIn(3600L)
                .build();
    }

    @Override
    public void logout(String refreshToken) {
        // 在实际应用中，你可能需要将刷新令牌加入黑名单
        // 这里简单实现，直接返回成功
    }
} 