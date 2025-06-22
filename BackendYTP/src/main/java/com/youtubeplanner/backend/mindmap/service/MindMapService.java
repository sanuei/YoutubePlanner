/*
 * 文件名：MindMapService.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图服务接口，定义思维导图相关的业务方法。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.mindmap.service;

import com.youtubeplanner.backend.common.PaginatedData;
import com.youtubeplanner.backend.mindmap.dto.MindMapRequest;
import com.youtubeplanner.backend.mindmap.dto.MindMapResponse;
import com.youtubeplanner.backend.mindmap.dto.MindMapListResponse;
import com.youtubeplanner.backend.user.entity.User;

public interface MindMapService {
    
    /**
     * 创建思维导图
     */
    MindMapResponse createMindMap(User user, MindMapRequest request);
    
    /**
     * 获取思维导图详情
     */
    MindMapResponse getMindMapById(User user, Long mindMapId);
    
    /**
     * 更新思维导图
     */
    MindMapResponse updateMindMap(User user, Long mindMapId, MindMapRequest request);
    
    /**
     * 删除思维导图（软删除）
     */
    void deleteMindMap(User user, Long mindMapId);
    
    /**
     * 获取用户的思维导图列表
     */
    PaginatedData<MindMapListResponse> getUserMindMaps(User user, int page, int limit, String search);
} 