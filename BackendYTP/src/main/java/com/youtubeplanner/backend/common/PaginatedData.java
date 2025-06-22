/*
 * 文件名：PaginatedData.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 分页数据响应类，用于返回分页查询结果。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.common;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PaginatedData<T> {
    private List<T> items;
    private PaginationInfo pagination;
} 