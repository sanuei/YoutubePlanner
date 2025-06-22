/*
 * 文件名：MindMapListResponse.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图列表响应DTO，用于返回思维导图列表数据（不包含详细的节点和连接线数据）。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.mindmap.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MindMapListResponse {
    private Long mindMapId;
    private String title;
    private String description;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 