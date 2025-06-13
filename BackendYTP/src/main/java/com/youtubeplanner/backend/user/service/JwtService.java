/*
 * 文件名：JwtService.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * JWT服务接口，用于处理JWT令牌的生成和验证。
 * 提供访问令牌和刷新令牌的生成方法。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.service;

import com.youtubeplanner.backend.user.entity.User;

public interface JwtService {
    String generateAccessToken(User user);
    String generateRefreshToken(User user);
    boolean validateToken(String token);
    String getUsernameFromToken(String token);
} 