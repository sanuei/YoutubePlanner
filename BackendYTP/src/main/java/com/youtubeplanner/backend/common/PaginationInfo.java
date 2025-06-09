/*
 * 文件名：PaginationInfo.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * 分页信息封装类，用于统一处理API的分页响应数据。
 * 包含了页码、每页数量、总记录数、总页数等分页相关信息。
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

@Data
public class PaginationInfo {
    private int page;
    private int limit;
    private long total;
    private int pages;
    
    @JsonProperty("has_next")
    private boolean hasNext;
    
    @JsonProperty("has_prev")
    private boolean hasPrev;

    public static PaginationInfo of(Page<?> page) {
        PaginationInfo info = new PaginationInfo();
        info.setPage(page.getNumber() + 1); // Spring Data JPA页码从0开始
        info.setLimit(page.getSize());
        info.setTotal(page.getTotalElements());
        info.setPages(page.getTotalPages());
        info.setHasNext(page.hasNext());
        info.setHasPrev(page.hasPrevious());
        return info;
    }
} 