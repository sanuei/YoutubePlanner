package com.youtubeplanner.backend.category;

import com.youtubeplanner.backend.category.dto.CreateCategoryRequest;
import com.youtubeplanner.backend.category.dto.CategoryResponse;
import com.youtubeplanner.backend.category.entity.Category;
import com.youtubeplanner.backend.category.repository.CategoryRepository;
import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public ApiResponse<CategoryResponse> createCategory(CreateCategoryRequest request, Long userId) {
        // 检查分类名称是否已存在
        if (categoryRepository.existsByUserIdAndCategoryName(userId, request.getCategoryName())) {
            return ApiResponse.error(409, "分类名称已存在");
        }

        Category category = new Category()
                .setCategoryName(request.getCategoryName())
                .setUserId(userId);

        Category savedCategory = categoryRepository.save(category);
        return ApiResponse.created(convertToResponse(savedCategory));
    }

    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<CategoryResponse>> getCategories(
            String search,
            Integer page,
            Integer limit,
            String sortBy,
            String order,
            Long userId) {
        // 设置默认值
        page = page == null ? 1 : page;
        limit = limit == null ? 10 : Math.min(limit, 100);
        sortBy = sortBy == null ? "createdAt" : sortBy;
        order = order == null ? "desc" : order;

        // 创建分页和排序
        Sort sort = Sort.by(Sort.Direction.fromString(order), sortBy);
        PageRequest pageRequest = PageRequest.of(page - 1, limit, sort);

        // 查询数据
        Page<Category> categoryPage = categoryRepository.findByUserIdAndSearch(userId, search, pageRequest);
        Page<CategoryResponse> responsePage = categoryPage.map(this::convertToResponse);

        return ApiResponse.success(PageResponse.of(responsePage));
    }

    @Transactional(readOnly = true)
    public ApiResponse<CategoryResponse> getCategoryDetail(Long categoryId, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElse(null);

        if (category == null) {
            return ApiResponse.error(404, "分类不存在");
        }

        if (!category.getUserId().equals(userId)) {
            return ApiResponse.error(403, "无权限访问该分类");
        }

        return ApiResponse.success(convertToResponse(category));
    }

    @Transactional
    public ApiResponse<CategoryResponse> updateCategory(Long categoryId, CreateCategoryRequest request, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElse(null);

        if (category == null) {
            return ApiResponse.error(404, "分类不存在");
        }

        if (!category.getUserId().equals(userId)) {
            return ApiResponse.error(403, "无权限访问该分类");
        }

        // 检查新名称是否与其他分类重复
        if (!category.getCategoryName().equals(request.getCategoryName()) &&
                categoryRepository.existsByUserIdAndCategoryName(userId, request.getCategoryName())) {
            return ApiResponse.error(409, "分类名称已存在");
        }

        category.setCategoryName(request.getCategoryName());
        Category updatedCategory = categoryRepository.save(category);
        return ApiResponse.success(convertToResponse(updatedCategory));
    }

    @Transactional
    public void deleteCategory(Long categoryId, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElse(null);

        if (category == null) {
            throw new RuntimeException("分类不存在");
        }

        if (!category.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除该分类");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse convertToResponse(Category category) {
        return new CategoryResponse()
                .setCategoryId(category.getCategoryId())
                .setCategoryName(category.getCategoryName())
                .setUserId(category.getUserId())
                .setCreatedAt(category.getCreatedAt());
    }
} 