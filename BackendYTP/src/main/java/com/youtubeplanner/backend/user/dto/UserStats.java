/*
 * 文件名：UserStats.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 用户统计信息DTO，用于返回用户的统计数据。
 * 包含脚本总数、频道总数和分类总数。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserStats {
    @JsonProperty("total_scripts")
    private Integer totalScripts;
    
    @JsonProperty("total_channels")
    private Integer totalChannels;
    
    @JsonProperty("total_categories")
    private Integer totalCategories;
} 