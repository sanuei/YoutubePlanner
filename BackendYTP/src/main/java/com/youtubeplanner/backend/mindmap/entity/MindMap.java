/*
 * 文件名：MindMap.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图实体类，用于存储思维导图的基本信息。
 * 包含思维导图ID、标题、内容、用户ID等字段。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.mindmap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mind_maps")
public class MindMap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mind_map_id")
    private Long mindMapId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "nodes_data", columnDefinition = "TEXT")
    private String nodesData; // JSON格式存储节点数据

    @Column(name = "edges_data", columnDefinition = "TEXT")
    private String edgesData; // JSON格式存储连接线数据

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;
} 