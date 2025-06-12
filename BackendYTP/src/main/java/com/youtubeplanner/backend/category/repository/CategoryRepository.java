package com.youtubeplanner.backend.category.repository;

import com.youtubeplanner.backend.category.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByUserIdAndCategoryName(Long userId, String categoryName);

    @Query(value = "SELECT c FROM Category c " +
           "WHERE c.userId = :userId " +
           "AND (:search IS NULL OR :search = '' OR " +
           "   LOWER(CAST(c.categoryName AS text)) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))")
    Page<Category> findByUserIdAndSearch(
            @Param("userId") Long userId,
            @Param("search") String search,
            Pageable pageable);
} 