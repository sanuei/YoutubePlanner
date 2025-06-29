/*
 * File: ChannelRepository.java
 * Created Date: 2024-03-19
 * Author: [Your Name]
 * Description: Channel数据访问层接口
 * -----
 * Last Modified: 2024-03-19
 * Modified By: [Your Name]
 * -----
 * Copyright (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.channel;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    boolean existsByUserIdAndChannelName(Long userId, String channelName);
    
    // 按用户ID统计频道数量（只统计未删除的）
    @Query("SELECT COUNT(c) FROM Channel c WHERE c.userId = :userId AND c.deleted = false")
    long countByUserId(@Param("userId") Long userId);
    
    // 按用户ID软删除频道
    @Modifying
    @Transactional
    @Query("UPDATE Channel c SET c.deleted = true WHERE c.userId = :userId AND c.deleted = false")
    void deleteByUserId(@Param("userId") Long userId);

    // 使用原生SQL直接删除频道
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM channels WHERE user_id = :userId", nativeQuery = true)
    void deleteChannelsByUserIdNative(@Param("userId") Long userId);
    
    // 查询用户的频道（只查询未删除的）
    @Query("SELECT c FROM Channel c WHERE c.userId = :userId AND c.deleted = false " +
           "AND (:search IS NULL OR :search = '' OR " +
           "LOWER(c.channelName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Channel> findByUserIdAndSearch(
            @Param("userId") Long userId,
            @Param("search") String search,
            Pageable pageable);

    // 查询特定频道（只查询未删除的）
    @Query("SELECT c FROM Channel c WHERE c.channelId = :channelId AND c.userId = :userId AND c.deleted = false")
    Optional<Channel> findByChannelIdAndUserId(@Param("channelId") Long channelId, @Param("userId") Long userId);
} 