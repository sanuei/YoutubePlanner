/*
 * 文件名：UserInfo.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 用户信息DTO，用于返回用户基本信息。
 * 包含用户ID和用户名。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserInfo {
    private Long userId;
    private String username;
} 