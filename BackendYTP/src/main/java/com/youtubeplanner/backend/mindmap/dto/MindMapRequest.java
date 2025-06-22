/*
 * 文件名：MindMapRequest.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图请求DTO，用于接收创建和更新思维导图的请求数据。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.mindmap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MindMapRequest {
    @NotBlank(message = "思维导图标题不能为空")
    @Size(min = 1, max = 255, message = "标题长度必须在1-255个字符之间")
    private String title;

    @Size(max = 1000, message = "描述长度不能超过1000个字符")
    private String description;

    private String nodesData; // JSON格式的节点数据

    private String edgesData; // JSON格式的连接线数据
} 