package com.youtubeplanner.backend.category.repository;

import com.youtubeplanner.backend.category.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByUserIdAndCategoryName(Long userId, String categoryName);
    
    // 按用户ID统计分类数量
    long countByUserId(Long userId);
    
    // 按用户ID删除分类
    @Modifying
    @Transactional
    void deleteByUserId(Long userId);

    @Query("SELECT c FROM Category c " +
           "WHERE c.userId = :userId " +
           "AND (:search IS NULL OR :search = '' OR " +
           "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Category> findByUserIdAndSearch(
            @Param("userId") Long userId,
            @Param("search") String search,
            Pageable pageable);
} 