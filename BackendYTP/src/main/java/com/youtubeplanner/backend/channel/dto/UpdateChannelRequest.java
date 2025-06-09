/*
 * 文件名：UpdateChannelRequest.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * 更新频道的请求DTO，包含更新频道所需的参数。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.channel.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateChannelRequest {
    // 频道名称：必填，长度1-100字符
    @NotBlank(message = "频道名称不能为空")
    @Size(min = 1, max = 100, message = "频道名称长度必须在1-100字符之间")
    @JsonProperty("channel_name")
    private String channelName;
} 