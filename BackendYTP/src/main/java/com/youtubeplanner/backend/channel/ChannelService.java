/*
 * File: ChannelService.java
 * Created Date: 2024-03-19
 * Author: [Your Name]
 * Description: Channel业务逻辑处理服务
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
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ChannelService {
    private final ChannelRepository channelRepository;

    public ChannelService(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    @Transactional
    public ApiResponse<Channel> createChannel(CreateChannelRequest request, Long userId) {
        // 检查频道名称是否已存在
        if (channelRepository.existsByUserIdAndChannelName(userId, request.getChannelName())) {
            return ApiResponse.error(409, "频道名称已存在");
        }

        // 创建新频道
        Channel channel = new Channel();
        channel.setChannelName(request.getChannelName());
        channel.setUserId(userId);

        Channel savedChannel = channelRepository.save(channel);
        return ApiResponse.created(savedChannel);
    }

    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<Channel>> getChannels(GetChannelsRequest request, Long userId) {
        Page<Channel> channelPage = channelRepository.findByUserIdAndSearch(
            userId,
            request.getSearch(),
            request.toPageRequest()
        );

        return ApiResponse.success(PageResponse.of(channelPage));
    }

    @Transactional(readOnly = true)
    public ApiResponse<ChannelDetailResponse> getChannelDetail(Long channelId, Long userId) {
        return channelRepository.findByChannelIdAndUserId(channelId, userId)
                .map(channel -> {
                    // TODO: 实现获取脚本数量的逻辑
                    Integer scriptsCount = 0; // 暂时返回0，等实现了脚本功能后再更新
                    return ApiResponse.success(ChannelDetailResponse.fromChannel(channel, scriptsCount));
                })
                .orElse(ApiResponse.error(404, "频道不存在"));
    }

    @Transactional
    public ApiResponse<Channel> updateChannel(Long channelId, Long userId, UpdateChannelRequest request) {
        // 1. 检查频道是否存在且属于当前用户
        Optional<Channel> channelOpt = channelRepository.findByChannelIdAndUserId(channelId, userId);
        if (channelOpt.isEmpty()) {
            return ApiResponse.error(404, "频道不存在");
        }

        Channel channel = channelOpt.get();
        
        // 2. 检查新的频道名称是否与其他频道冲突
        if (!channel.getChannelName().equals(request.getChannelName()) &&
                channelRepository.existsByUserIdAndChannelName(userId, request.getChannelName())) {
            return ApiResponse.error(409, "频道名称已存在");
        }

        // 3. 更新频道信息
        channel.setChannelName(request.getChannelName());
        Channel updatedChannel = channelRepository.save(channel);
        return ApiResponse.success(updatedChannel);
    }

    /**
     * 删除频道
     * 采用软删除策略，将频道标记为已删除而不是真正删除数据
     *
     * @param channelId 频道ID
     * @param userId 用户ID
     * @return 删除结果响应
     */
    @Transactional
    public ApiResponse<Void> deleteChannel(Long channelId, Long userId) {
        // 1. 检查频道是否存在且属于当前用户
        Optional<Channel> channelOpt = channelRepository.findByChannelIdAndUserId(channelId, userId);
        if (channelOpt.isEmpty()) {
            return ApiResponse.error(404, "频道不存在");
        }

        // 2. 执行软删除
        channelRepository.delete(channelOpt.get());
        
        // 3. 返回成功响应
        return ApiResponse.success(204, "删除成功", null);
    }
} 