package com.youtubeplanner.backend.script.mapper;

import com.youtubeplanner.backend.script.entity.Script;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ScriptMapper {
    boolean existsByUserIdAndChannelId(@Param("userId") Long userId, @Param("channelId") Long channelId);
    
    boolean existsByUserIdAndCategoryId(@Param("userId") Long userId, @Param("categoryId") Long categoryId);
    
    List<Script> findByUserIdAndFilters(
            @Param("userId") Long userId,
            @Param("channelId") Long channelId,
            @Param("categoryId") Long categoryId,
            @Param("status") String status,
            @Param("difficulty") Integer difficulty,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            @Param("search") String search,
            @Param("offset") int offset,
            @Param("pageSize") int pageSize);
            
    long countByUserIdAndFilters(
            @Param("userId") Long userId,
            @Param("channelId") Long channelId,
            @Param("categoryId") Long categoryId,
            @Param("status") String status,
            @Param("difficulty") Integer difficulty,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            @Param("search") String search);
} 