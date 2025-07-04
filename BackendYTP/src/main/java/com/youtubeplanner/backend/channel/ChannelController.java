/*
 * File: ChannelController.java
 * Created Date: 2024-03-19
 * Author: [Your Name]
 * Description: Channel相关的API接口控制器
 * -----
 * Last Modified: 2024-03-19
 * Modified By: [Your Name]
 * -----
 * Copyright (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.channel;

import com.youtubeplanner.backend.channel.dto.ChannelDetailResponse;
import com.youtubeplanner.backend.channel.dto.CreateChannelRequest;
import com.youtubeplanner.backend.channel.dto.GetChannelsRequest;
import com.youtubeplanner.backend.channel.dto.UpdateChannelRequest;
import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-path}/channels")
@RequiredArgsConstructor
public class ChannelController {
    private final ChannelService channelService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Channel> createChannel(
            @Valid @RequestBody CreateChannelRequest request) {
        Long userId = getUserIdFromContext();
        return channelService.createChannel(request, userId);
    }

    @GetMapping
    public ApiResponse<PageResponse<Channel>> getChannels(
            @Valid @ModelAttribute GetChannelsRequest request) {
        Long userId = getUserIdFromContext();
        return channelService.getChannels(request, userId);
    }

    @GetMapping("/{channelId}")
    public ApiResponse<ChannelDetailResponse> getChannelDetail(
            @PathVariable Long channelId) {
        Long userId = getUserIdFromContext();
        return channelService.getChannelDetail(channelId, userId);
    }

    @PutMapping("/{channelId}")
    public ApiResponse<Channel> updateChannel(
            @PathVariable Long channelId,
            @Valid @RequestBody UpdateChannelRequest request) {
        Long userId = getUserIdFromContext();
        return channelService.updateChannel(channelId, userId, request);
    }

    /**
     * 删除频道
     * 采用软删除策略，将频道标记为已删除而不是真正删除数据
     *
     * @param channelId 频道ID
     * @return 删除结果响应
     */
    @DeleteMapping("/{channelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> deleteChannel(
            @PathVariable Long channelId) {
        Long userId = getUserIdFromContext();
        return channelService.deleteChannel(channelId, userId);
    }

    private Long getUserIdFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("用户未认证");
        }
        com.youtubeplanner.backend.user.entity.User user = (com.youtubeplanner.backend.user.entity.User) authentication.getPrincipal();
        return user.getUserId();
    }
} 