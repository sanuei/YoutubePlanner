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
        return Long.parseLong(authentication.getName());
    }
} 