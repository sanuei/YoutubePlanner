/*
 * 文件名：GetChannelsRequest.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * 获取频道列表的请求参数封装类，包含分页、排序和搜索等参数。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.channel.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Data
public class GetChannelsRequest {
    @Min(value = 1, message = "页码最小为1")
    private Integer page = 1;

    @Min(value = 1, message = "每页数量最小为1")
    @Max(value = 100, message = "每页数量最大为100")
    private Integer limit = 10;

    private String search;

    private String sortBy = "created_at";
    private String order = "desc";

    public PageRequest toPageRequest() {
        // 将页码转换为从0开始
        int pageIndex = page - 1;
        
        // 验证并转换排序字段
        String sortField = switch (sortBy) {
            case "channel_name" -> "channelName";
            case "created_at" -> "createdAt";
            default -> "createdAt";
        };

        // 创建排序对象
        Sort sort = Sort.by(
            "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC,
            sortField
        );

        return PageRequest.of(pageIndex, limit, sort);
    }
} 