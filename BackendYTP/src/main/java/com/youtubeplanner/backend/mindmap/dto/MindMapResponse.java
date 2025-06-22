/*
 * 文件名：MindMapResponse.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图响应DTO，用于返回思维导图数据。
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
public class MindMapResponse {
    private Long mindMapId;
    private String title;
    private String description;
    private String nodesData;
    private String edgesData;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 