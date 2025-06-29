package com.youtubeplanner.backend.user.service.impl;

import com.youtubeplanner.backend.common.response.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.user.dto.AdminUserListResponse;
import com.youtubeplanner.backend.user.dto.AdminUpdateUserRequest;
import com.youtubeplanner.backend.user.dto.UserStats;
import com.youtubeplanner.backend.user.entity.User;
import com.youtubeplanner.backend.user.entity.Role;
import com.youtubeplanner.backend.user.repository.UserRepository;
import com.youtubeplanner.backend.user.service.AdminUserService;
import com.youtubeplanner.backend.script.repository.ScriptRepository;
import com.youtubeplanner.backend.channel.ChannelRepository;
import com.youtubeplanner.backend.category.repository.CategoryRepository;
import com.youtubeplanner.backend.mindmap.repository.MindMapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {
    private final UserRepository userRepository;
    private final ScriptRepository scriptRepository;
    private final ChannelRepository channelRepository;
    private final CategoryRepository categoryRepository;
    private final MindMapRepository mindMapRepository;

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<AdminUserListResponse>> getAllUsers(int page, int limit, String search, String sortBy, String order) {
        try {
            // 设置默认值
            page = Math.max(1, page);
            limit = Math.min(Math.max(1, limit), 100);
            sortBy = sortBy == null ? "createdAt" : sortBy;
            order = order == null ? "desc" : order;

            // 验证排序字段，避免在null字段上排序
            if ("role".equals(sortBy)) {
                log.warn("检测到role字段排序请求，由于存在null值，改为按createdAt排序");
                sortBy = "createdAt";
            }

            // 创建分页和排序
            Sort sort = Sort.by(Sort.Direction.fromString(order), sortBy);
            PageRequest pageRequest = PageRequest.of(page - 1, limit, sort);

            // 查询用户
            Page<User> userPage;
            if (search != null && !search.trim().isEmpty()) {
                userPage = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    search.trim(), search.trim(), pageRequest);
            } else {
                userPage = userRepository.findAll(pageRequest);
            }

            // 转换为响应DTO
            Page<AdminUserListResponse> responsePage = userPage.map(this::convertToAdminUserResponse);
            
            return ApiResponse.success(PageResponse.of(responsePage));
        } catch (Exception e) {
            log.error("获取用户列表失败", e);
            return ApiResponse.error(500, "获取用户列表失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AdminUserListResponse> getUserById(Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error(404, "用户不存在");
            }
            
            return ApiResponse.success(convertToAdminUserResponse(user));
        } catch (Exception e) {
            log.error("获取用户详情失败，用户ID: {}", userId, e);
            return ApiResponse.error(500, "获取用户详情失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<AdminUserListResponse> updateUser(Long userId, AdminUpdateUserRequest request) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error(404, "用户不存在");
            }

            // 更新邮箱
            if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    return ApiResponse.error(400, "邮箱已被使用");
                }
                user.setEmail(request.getEmail());
            }

            // 更新显示名称
            if (request.getDisplayName() != null) {
                user.setDisplayName(request.getDisplayName());
            }

            // 更新角色
            if (request.getRole() != null) {
                try {
                    Role role = Role.valueOf(request.getRole().toUpperCase());
                    user.setRole(role);
                } catch (IllegalArgumentException e) {
                    return ApiResponse.error(400, "无效的角色: " + request.getRole());
                }
            }

            user = userRepository.save(user);
            return ApiResponse.success("用户信息更新成功", convertToAdminUserResponse(user));
        } catch (Exception e) {
            log.error("更新用户信息失败，用户ID: {}", userId, e);
            return ApiResponse.error(500, "更新用户信息失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteUser(Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error(404, "用户不存在");
            }

            // 检查是否是管理员
            if (user.getRole() == Role.ADMIN) {
                // 检查是否还有其他管理员
                long adminCount = userRepository.countByRole(Role.ADMIN);
                if (adminCount <= 1) {
                    return ApiResponse.error(400, "不能删除最后一个管理员账户");
                }
            }

            log.info("开始删除用户 {} (ID: {}) 及其所有相关数据", user.getUsername(), userId);

            // 按照外键依赖关系的顺序删除数据
            // 1. 删除脚本（会级联删除脚本章节）
            long scriptCount = scriptRepository.countByUserId(userId);
            if (scriptCount > 0) {
                log.info("删除用户 {} 的 {} 个脚本", user.getUsername(), scriptCount);
                scriptRepository.deleteByUserId(userId);
            }

            // 2. 删除思维导图
            long mindMapCount = mindMapRepository.countByUserIdAndNotDeleted(userId);
            if (mindMapCount > 0) {
                log.info("删除用户 {} 的 {} 个思维导图", user.getUsername(), mindMapCount);
                mindMapRepository.deleteByUserId(userId);
            }

            // 3. 删除频道（使用原生SQL直接删除，绕过Hibernate）
            long channelCount = channelRepository.countByUserId(userId);
            if (channelCount > 0) {
                log.info("删除用户 {} 的 {} 个频道", user.getUsername(), channelCount);
                channelRepository.deleteChannelsByUserIdNative(userId);
            }

            // 4. 删除分类
            long categoryCount = categoryRepository.countByUserId(userId);
            if (categoryCount > 0) {
                log.info("删除用户 {} 的 {} 个分类", user.getUsername(), categoryCount);
                categoryRepository.deleteByUserId(userId);
            }

            // 5. 最后删除用户（使用原生SQL直接删除，绕过Hibernate）
            userRepository.deleteUserByIdNative(userId);
            
            log.info("成功删除用户 {} 及其所有相关数据：脚本{}个，思维导图{}个，频道{}个，分类{}个", 
                    user.getUsername(), scriptCount, mindMapCount, channelCount, categoryCount);
            
            return ApiResponse.success("用户删除成功", null);
        } catch (Exception e) {
            log.error("删除用户失败，用户ID: {}", userId, e);
            return ApiResponse.error(500, "删除用户失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<AdminUserListResponse> updateUserRole(Long userId, String role) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error(404, "用户不存在");
            }

            Role newRole;
            try {
                newRole = Role.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ApiResponse.error(400, "无效的角色: " + role);
            }

            // 如果要将管理员降级为普通用户，检查是否还有其他管理员
            if (user.getRole() == Role.ADMIN && newRole == Role.USER) {
                long adminCount = userRepository.countByRole(Role.ADMIN);
                if (adminCount <= 1) {
                    return ApiResponse.error(400, "不能降级最后一个管理员账户");
                }
            }

            user.setRole(newRole);
            user = userRepository.save(user);
            
            return ApiResponse.success("用户角色更新成功", convertToAdminUserResponse(user));
        } catch (Exception e) {
            log.error("更新用户角色失败，用户ID: {}, 角色: {}", userId, role, e);
            return ApiResponse.error(500, "更新用户角色失败: " + e.getMessage());
        }
    }

    private AdminUserListResponse convertToAdminUserResponse(User user) {
        // 实现获取用户统计信息的逻辑
        int scriptCount = (int) scriptRepository.countByUserId(user.getUserId());
        int channelCount = (int) channelRepository.countByUserId(user.getUserId());
        int categoryCount = (int) categoryRepository.countByUserId(user.getUserId());
        
        UserStats stats = UserStats.builder()
                .totalScripts(scriptCount)
                .totalChannels(channelCount)
                .totalCategories(categoryCount)
                .build();

        // 处理role为null的情况
        String roleName = null;
        if (user.getRole() != null) {
            roleName = user.getRole().name();
        } else {
            // 如果角色为null，设置默认角色为USER
            roleName = "USER";
            log.warn("用户{}的角色为null，使用默认角色USER", user.getUsername());
        }

        return AdminUserListResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(roleName)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .stats(stats)
                .build();
    }
} 