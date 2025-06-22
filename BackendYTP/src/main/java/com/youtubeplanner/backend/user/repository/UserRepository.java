/*
 * 文件名：UserRepository.java
 * 创建日期：2024年3月19日
 * 作者：Yan Sanuei
 * 
 * 文件描述：
 * 用户仓库接口，用于操作用户数据。
 * 提供用户相关的数据库操作方法。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2025 YoutubePlanner
 */

package com.youtubeplanner.backend.user.repository;

import com.youtubeplanner.backend.user.entity.User;
import com.youtubeplanner.backend.user.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // 管理员功能相关方法
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String username, String email, Pageable pageable);
    long countByRole(Role role);
} 