/*
 * 文件名：ChannelDetailResponse.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * 频道详情响应DTO，包含了频道的基本信息和统计数据。
 * 用于返回给前端展示频道的详细信息。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.channel.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.Instant;

@Data
@Accessors(chain = true)
public class ChannelDetailResponse {
    @JsonProperty("channel_id")
    private Long channelId;

    @JsonProperty("channel_name")
    private String channelName;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("scripts_count")
    private Integer scriptsCount;

    // 从Channel实体转换为DTO
    public static ChannelDetailResponse fromChannel(com.youtubeplanner.backend.channel.Channel channel, Integer scriptsCount) {
        return new ChannelDetailResponse()
                .setChannelId(channel.getChannelId())
                .setChannelName(channel.getChannelName())
                .setUserId(channel.getUserId())
                .setCreatedAt(channel.getCreatedAt())
                .setScriptsCount(scriptsCount);
    }
} 