/*
 * 文件名：MindMapServiceImpl.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图服务实现类，实现思维导图相关的业务逻辑。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.mindmap.service.impl;

import com.youtubeplanner.backend.common.PaginatedData;
import com.youtubeplanner.backend.common.PaginationInfo;
import com.youtubeplanner.backend.mindmap.dto.MindMapRequest;
import com.youtubeplanner.backend.mindmap.dto.MindMapResponse;
import com.youtubeplanner.backend.mindmap.dto.MindMapListResponse;
import com.youtubeplanner.backend.mindmap.entity.MindMap;
import com.youtubeplanner.backend.mindmap.repository.MindMapRepository;
import com.youtubeplanner.backend.mindmap.service.MindMapService;
import com.youtubeplanner.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MindMapServiceImpl implements MindMapService {
    
    private final MindMapRepository mindMapRepository;
    
    @Override
    @Transactional
    public MindMapResponse createMindMap(User user, MindMapRequest request) {
        log.debug("创建思维导图，用户ID: {}, 标题: {}", user.getUserId(), request.getTitle());
        
        MindMap mindMap = MindMap.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .nodesData(request.getNodesData())
                .edgesData(request.getEdgesData())
                .userId(user.getUserId())
                .build();
        
        MindMap savedMindMap = mindMapRepository.save(mindMap);
        return convertToResponse(savedMindMap);
    }
    
    @Override
    public MindMapResponse getMindMapById(User user, Long mindMapId) {
        log.debug("获取思维导图详情，用户ID: {}, 思维导图ID: {}", user.getUserId(), mindMapId);
        
        MindMap mindMap = mindMapRepository.findById(mindMapId)
                .orElseThrow(() -> new RuntimeException("思维导图不存在"));
        
        if (!mindMap.getUserId().equals(user.getUserId()) || mindMap.isDeleted()) {
            throw new RuntimeException("无权访问该思维导图");
        }
        
        return convertToResponse(mindMap);
    }
    
    @Override
    @Transactional
    public MindMapResponse updateMindMap(User user, Long mindMapId, MindMapRequest request) {
        log.debug("更新思维导图，用户ID: {}, 思维导图ID: {}", user.getUserId(), mindMapId);
        
        MindMap mindMap = mindMapRepository.findById(mindMapId)
                .orElseThrow(() -> new RuntimeException("思维导图不存在"));
        
        if (!mindMap.getUserId().equals(user.getUserId()) || mindMap.isDeleted()) {
            throw new RuntimeException("无权修改该思维导图");
        }
        
        mindMap.setTitle(request.getTitle());
        mindMap.setDescription(request.getDescription());
        mindMap.setNodesData(request.getNodesData());
        mindMap.setEdgesData(request.getEdgesData());
        
        MindMap savedMindMap = mindMapRepository.save(mindMap);
        return convertToResponse(savedMindMap);
    }
    
    @Override
    @Transactional
    public void deleteMindMap(User user, Long mindMapId) {
        log.debug("删除思维导图，用户ID: {}, 思维导图ID: {}", user.getUserId(), mindMapId);
        
        MindMap mindMap = mindMapRepository.findById(mindMapId)
                .orElseThrow(() -> new RuntimeException("思维导图不存在"));
        
        if (!mindMap.getUserId().equals(user.getUserId()) || mindMap.isDeleted()) {
            throw new RuntimeException("无权删除该思维导图");
        }
        
        mindMap.setDeleted(true);
        mindMapRepository.save(mindMap);
    }
    
    @Override
    public PaginatedData<MindMapListResponse> getUserMindMaps(User user, int page, int limit, String search) {
        log.debug("获取用户思维导图列表，用户ID: {}, 页码: {}, 每页数量: {}, 搜索: {}", 
                user.getUserId(), page, limit, search);
        
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<MindMap> mindMapPage;
        
        if (search != null && !search.trim().isEmpty()) {
            mindMapPage = mindMapRepository.findByUserIdAndTitleContainingAndNotDeleted(
                    user.getUserId(), search.trim(), pageable);
        } else {
            mindMapPage = mindMapRepository.findByUserIdAndNotDeleted(user.getUserId(), pageable);
        }
        
        List<MindMapListResponse> items = mindMapPage.getContent().stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
        
        PaginationInfo pagination = PaginationInfo.builder()
                .page(page)
                .limit(limit)
                .total((int) mindMapPage.getTotalElements())
                .pages(mindMapPage.getTotalPages())
                .hasNext(mindMapPage.hasNext())
                .hasPrev(mindMapPage.hasPrevious())
                .build();
        
        return PaginatedData.<MindMapListResponse>builder()
                .items(items)
                .pagination(pagination)
                .build();
    }
    
    private MindMapResponse convertToResponse(MindMap mindMap) {
        return MindMapResponse.builder()
                .mindMapId(mindMap.getMindMapId())
                .title(mindMap.getTitle())
                .description(mindMap.getDescription())
                .nodesData(mindMap.getNodesData())
                .edgesData(mindMap.getEdgesData())
                .userId(mindMap.getUserId())
                .createdAt(mindMap.getCreatedAt())
                .updatedAt(mindMap.getUpdatedAt())
                .build();
    }
    
    private MindMapListResponse convertToListResponse(MindMap mindMap) {
        return MindMapListResponse.builder()
                .mindMapId(mindMap.getMindMapId())
                .title(mindMap.getTitle())
                .description(mindMap.getDescription())
                .userId(mindMap.getUserId())
                .createdAt(mindMap.getCreatedAt())
                .updatedAt(mindMap.getUpdatedAt())
                .build();
    }
} 