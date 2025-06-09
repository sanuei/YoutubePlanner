/*
 * 文件名：PageResponse.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * 分页数据响应封装类，用于统一处理API的分页列表响应。
 * 包含了数据项列表和分页信息。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> items;
    private PaginationInfo pagination;

    public static <T> PageResponse<T> of(Page<T> page) {
        PageResponse<T> response = new PageResponse<>();
        response.setItems(page.getContent());
        response.setPagination(PaginationInfo.of(page));
        return response;
    }
} 