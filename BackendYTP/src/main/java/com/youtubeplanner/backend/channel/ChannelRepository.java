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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    boolean existsByUserIdAndChannelName(Long userId, String channelName);
    
    @Query("SELECT c FROM Channel c WHERE c.userId = :userId " +
           "AND (:search IS NULL OR CAST(c.channelName AS string) LIKE CONCAT('%', CAST(:search AS string), '%'))")
    Page<Channel> findByUserIdAndSearch(
            @Param("userId") Long userId,
            @Param("search") String search,
            Pageable pageable);

    Optional<Channel> findByChannelIdAndUserId(Long channelId, Long userId);
} 