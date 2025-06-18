/*
 * 文件名：CategoryController.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * 分类控制器，处理分类相关的HTTP请求。
 * 包括创建、查询、更新和删除分类的功能。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.category;

import com.youtubeplanner.backend.category.dto.CreateCategoryRequest;
import com.youtubeplanner.backend.category.dto.CategoryResponse;
import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request) {
        return categoryService.createCategory(request, getUserIdFromContext());
    }

    @GetMapping
    public ApiResponse<PageResponse<CategoryResponse>> getCategories(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String order) {
        return categoryService.getCategories(search, page, limit, sortBy, order, getUserIdFromContext());
    }

    @GetMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> getCategoryDetail(
            @PathVariable Long categoryId) {
        return categoryService.getCategoryDetail(categoryId, getUserIdFromContext());
    }

    @PutMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CreateCategoryRequest request) {
        return categoryService.updateCategory(categoryId, request, getUserIdFromContext());
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(
            @PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId, getUserIdFromContext());
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