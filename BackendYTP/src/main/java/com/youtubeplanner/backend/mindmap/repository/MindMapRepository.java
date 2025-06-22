/*
 * 文件名：MindMapRepository.java
 * 创建日期：2024年12月XX日
 * 作者：Yann
 * 
 * 文件描述：
 * 思维导图仓库接口，用于操作思维导图数据。
 * 提供思维导图相关的数据库操作方法。
 * 
 * 修改历史：
 * 2024年12月XX日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.mindmap.repository;

import com.youtubeplanner.backend.mindmap.entity.MindMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MindMapRepository extends JpaRepository<MindMap, Long> {
    
    @Query("SELECT m FROM MindMap m WHERE m.userId = :userId AND m.isDeleted = false ORDER BY m.updatedAt DESC")
    Page<MindMap> findByUserIdAndNotDeleted(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT m FROM MindMap m WHERE m.userId = :userId AND m.isDeleted = false AND m.title LIKE %:title% ORDER BY m.updatedAt DESC")
    Page<MindMap> findByUserIdAndTitleContainingAndNotDeleted(@Param("userId") Long userId, @Param("title") String title, Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM MindMap m WHERE m.userId = :userId AND m.isDeleted = false")
    long countByUserIdAndNotDeleted(@Param("userId") Long userId);
} 