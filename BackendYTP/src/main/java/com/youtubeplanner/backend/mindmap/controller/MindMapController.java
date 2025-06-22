/*
 * 文件名：MindMapController.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图控制器，处理思维导图相关的HTTP请求。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.mindmap.controller;

import com.youtubeplanner.backend.common.response.ApiResponse;
import com.youtubeplanner.backend.common.PaginatedData;
import com.youtubeplanner.backend.mindmap.dto.MindMapRequest;
import com.youtubeplanner.backend.mindmap.dto.MindMapResponse;
import com.youtubeplanner.backend.mindmap.dto.MindMapListResponse;
import com.youtubeplanner.backend.mindmap.service.MindMapService;
import com.youtubeplanner.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/mindmaps")
@RequiredArgsConstructor
public class MindMapController {
    
    private final MindMapService mindMapService;
    
    @PostMapping
    public ApiResponse<MindMapResponse> createMindMap(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MindMapRequest request) {
        log.debug("创建思维导图请求，用户ID: {}", user != null ? user.getUserId() : "null");
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        MindMapResponse response = mindMapService.createMindMap(user, request);
        return ApiResponse.success("思维导图创建成功", response);
    }
    
    @GetMapping("/{mindMapId}")
    public ApiResponse<MindMapResponse> getMindMapById(
            @AuthenticationPrincipal User user,
            @PathVariable Long mindMapId) {
        log.debug("获取思维导图详情，用户ID: {}, 思维导图ID: {}", 
                user != null ? user.getUserId() : "null", mindMapId);
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        MindMapResponse response = mindMapService.getMindMapById(user, mindMapId);
        return ApiResponse.success(response);
    }
    
    @PutMapping("/{mindMapId}")
    public ApiResponse<MindMapResponse> updateMindMap(
            @AuthenticationPrincipal User user,
            @PathVariable Long mindMapId,
            @Valid @RequestBody MindMapRequest request) {
        log.debug("更新思维导图，用户ID: {}, 思维导图ID: {}", 
                user != null ? user.getUserId() : "null", mindMapId);
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        MindMapResponse response = mindMapService.updateMindMap(user, mindMapId, request);
        return ApiResponse.success("思维导图更新成功", response);
    }
    
    @DeleteMapping("/{mindMapId}")
    public ApiResponse<Void> deleteMindMap(
            @AuthenticationPrincipal User user,
            @PathVariable Long mindMapId) {
        log.debug("删除思维导图，用户ID: {}, 思维导图ID: {}", 
                user != null ? user.getUserId() : "null", mindMapId);
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        mindMapService.deleteMindMap(user, mindMapId);
        return ApiResponse.success("思维导图删除成功", null);
    }
    
    @GetMapping
    public ApiResponse<PaginatedData<MindMapListResponse>> getUserMindMaps(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        log.debug("获取用户思维导图列表，用户ID: {}, 页码: {}, 每页数量: {}, 搜索: {}", 
                user != null ? user.getUserId() : "null", page, limit, search);
        if (user == null) {
            return ApiResponse.error(401, "用户未认证");
        }
        PaginatedData<MindMapListResponse> response = mindMapService.getUserMindMaps(user, page, limit, search);
        return ApiResponse.success(response);
    }
} 