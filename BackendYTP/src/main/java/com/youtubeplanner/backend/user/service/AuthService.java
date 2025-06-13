/*
 * 文件名：AuthService.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 认证服务接口，定义用户认证相关的业务方法。
 * 包括注册、登录、刷新令牌和登出功能。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.service;

import com.youtubeplanner.backend.user.dto.*;

public interface AuthService {
    UserInfo register(RegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse refreshToken(String refreshToken);
    void logout(String refreshToken);
} 