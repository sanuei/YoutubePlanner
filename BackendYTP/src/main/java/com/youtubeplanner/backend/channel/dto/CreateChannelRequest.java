/*
 * File: CreateChannelRequest.java
 * Created Date: 2024-03-19
 * Author: [Your Name]
 * Description: 创建频道的请求DTO
 * -----
 * Last Modified: 2024-03-19
 * Modified By: [Your Name]
 * -----
 * Copyright (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.channel.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateChannelRequest {
    @NotBlank(message = "频道名称不能为空")
    @Size(min = 1, max = 100, message = "频道名称长度必须在1-100字符之间")
    @JsonProperty("channel_name")
    private String channelName;
} 