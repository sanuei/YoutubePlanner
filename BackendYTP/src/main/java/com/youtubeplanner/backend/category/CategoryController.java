package com.youtubeplanner.backend.category;

import com.youtubeplanner.backend.category.dto.CreateCategoryRequest;
import com.youtubeplanner.backend.category.dto.CategoryResponse;
import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        return categoryService.createCategory(request, userId);
    }

    @GetMapping
    public ApiResponse<PageResponse<CategoryResponse>> getCategories(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String order,
            @RequestHeader("X-User-ID") Long userId) {
        return categoryService.getCategories(search, page, limit, sortBy, order, userId);
    }

    @GetMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> getCategoryDetail(
            @PathVariable Long categoryId,
            @RequestHeader("X-User-ID") Long userId) {
        return categoryService.getCategoryDetail(categoryId, userId);
    }

    @PutMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CreateCategoryRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        return categoryService.updateCategory(categoryId, request, userId);
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(
            @PathVariable Long categoryId,
            @RequestHeader("X-User-ID") Long userId) {
        categoryService.deleteCategory(categoryId, userId);
    }
} 