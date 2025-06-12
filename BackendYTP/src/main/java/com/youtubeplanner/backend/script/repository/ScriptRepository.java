package com.youtubeplanner.backend.script.repository;

import com.youtubeplanner.backend.script.entity.Script;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ScriptRepository extends JpaRepository<Script, Long> {
    boolean existsByUserIdAndChannelId(Long userId, Long channelId);
    boolean existsByUserIdAndCategoryId(Long userId, Long categoryId);

    @Query(value = "SELECT s FROM Script s " +
           "WHERE s.userId = :userId " +
           "AND (:channelId IS NULL OR s.channelId = :channelId) " +
           "AND (:categoryId IS NULL OR s.categoryId = :categoryId) " +
           "AND (:status IS NULL OR :status = '' OR s.status = :status) " +
           "AND (:difficulty IS NULL OR s.difficulty = :difficulty) " +
           "AND (:dateFrom IS NULL OR s.releaseDate >= :dateFrom) " +
           "AND (:dateTo IS NULL OR s.releaseDate <= :dateTo) " +
           "AND (:search IS NULL OR :search = '' OR " +
           "   LOWER(CAST(s.title AS text)) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) OR " +
           "   LOWER(CAST(s.description AS text)) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))")
    Page<Script> findByUserIdAndFilters(
            @Param("userId") Long userId,
            @Param("channelId") Long channelId,
            @Param("categoryId") Long categoryId,
            @Param("status") String status,
            @Param("difficulty") Integer difficulty,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            @Param("search") String search,
            Pageable pageable);
} 