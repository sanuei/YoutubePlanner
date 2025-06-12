package com.youtubeplanner.backend.script.service;

import com.youtubeplanner.backend.channel.ChannelService;
import com.youtubeplanner.backend.category.CategoryService;
import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.common.PaginationInfo;
import com.youtubeplanner.backend.script.dto.CreateScriptRequest;
import com.youtubeplanner.backend.script.dto.GetScriptsRequest;
import com.youtubeplanner.backend.script.dto.ScriptListItemResponse;
import com.youtubeplanner.backend.script.dto.ScriptResponse;
import com.youtubeplanner.backend.script.entity.Script;
import com.youtubeplanner.backend.script.entity.ScriptChapter;
import com.youtubeplanner.backend.script.mapper.ScriptMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ScriptServiceImpl implements ScriptService {
    private static final Logger logger = LoggerFactory.getLogger(ScriptServiceImpl.class);
    private final ScriptMapper scriptMapper;
    private final ChannelService channelService;
    private final CategoryService categoryService;

    public ScriptServiceImpl(ScriptMapper scriptMapper, ChannelService channelService, CategoryService categoryService) {
        this.scriptMapper = scriptMapper;
        this.channelService = channelService;
        this.categoryService = categoryService;
        logger.error("=== TEST LOG MESSAGE ===");  // 使用 ERROR 级别确保一定会显示
    }

    @Override
    @Transactional
    public ApiResponse<ScriptResponse> createScript(CreateScriptRequest request, Long userId) {
        // 验证频道权限
        if (request.getChannelId() != null) {
            var channelResponse = channelService.getChannelDetail(request.getChannelId(), userId);
            if (!channelResponse.isSuccess()) {
                return ApiResponse.error(403, "无权限访问该频道");
            }
        }

        // 验证章节编号唯一性
        if (request.getChapters() != null) {
            Set<Integer> chapterNumbers = new HashSet<>();
            for (var chapter : request.getChapters()) {
                if (!chapterNumbers.add(chapter.getChapterNumber())) {
                    return ApiResponse.error(409, "章节编号重复");
                }
            }
        }

        // 创建脚本
        Script script = new Script()
                .setTitle(request.getTitle())
                .setAlternativeTitle1(request.getAlternativeTitle1())
                .setDescription(request.getDescription())
                .setDifficulty(request.getDifficulty())
                .setStatus(request.getStatus())
                .setReleaseDate(request.getReleaseDate())
                .setUserId(userId)
                .setChannelId(request.getChannelId())
                .setCategoryId(request.getCategoryId());

        // 创建章节
        if (request.getChapters() != null) {
            script.setChapters(request.getChapters().stream()
                    .map(chapterRequest -> new ScriptChapter()
                            .setScript(script)
                            .setChapterNumber(chapterRequest.getChapterNumber())
                            .setTitle(chapterRequest.getTitle())
                            .setContent(chapterRequest.getContent()))
                    .collect(Collectors.toList()));
        }

        // TODO: 实现保存逻辑
        return ApiResponse.created(convertToResponse(script));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<ScriptListItemResponse>> getScripts(GetScriptsRequest request, Long userId) {
        // 将页码转换为从0开始
        int offset = (request.getPage() - 1) * request.getSize();
        
        // 使用更明确的日志级别
        logger.error("=== Script Query Debug Info ===");
        logger.error("Query Parameters:");
        logger.error("channelId: {}", request.getChannelId());
        logger.error("categoryId: {}", request.getCategoryId());
        logger.error("status: {}", request.getStatus());
        logger.error("difficulty: {}", request.getDifficulty());
        logger.error("search: {}", request.getSearch());
        logger.error("page: {}", request.getPage());
        logger.error("size: {}", request.getSize());
        logger.error("userId: {}", userId);
        
        List<Script> scripts = scriptMapper.findByUserIdAndFilters(
                userId,
                request.getChannelId(),
                request.getCategoryId(),
                request.getStatus(),
                request.getDifficulty(),
                request.getDateFrom(),
                request.getDateTo(),
                request.getSearch(),
                offset,
                request.getSize()
        );

        logger.error("Query Results:");
        logger.error("Total scripts found: {}", scripts.size());
        for (Script script : scripts) {
            logger.error("Script Details:");
            logger.error("  ID: {}", script.getScriptId());
            logger.error("  Title: {}", script.getTitle());
            logger.error("  Channel ID: {}", script.getChannelId());
            logger.error("  Category ID: {}", script.getCategoryId());
            logger.error("  Status: {}", script.getStatus());
        }

        long total = scriptMapper.countByUserIdAndFilters(
                userId,
                request.getChannelId(),
                request.getCategoryId(),
                request.getStatus(),
                request.getDifficulty(),
                request.getDateFrom(),
                request.getDateTo(),
                request.getSearch()
        );

        List<ScriptListItemResponse> responseList = scripts.stream()
                .map(script -> convertToListItemResponse(script, userId, request.getIncludeFields()))
                .collect(Collectors.toList());

        PageResponse<ScriptListItemResponse> pageResponse = new PageResponse<>();
        pageResponse.setItems(responseList);
        
        PaginationInfo paginationInfo = new PaginationInfo();
        paginationInfo.setPage(request.getPage()); // 使用原始页码（从1开始）
        paginationInfo.setLimit(request.getSize());
        paginationInfo.setTotal(total);
        paginationInfo.setPages((int) Math.ceil((double) total / request.getSize()));
        paginationInfo.setHasNext(request.getPage() < paginationInfo.getPages());
        paginationInfo.setHasPrev(request.getPage() > 1);
        
        pageResponse.setPagination(paginationInfo);

        return ApiResponse.success(pageResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<ScriptResponse> getScriptDetail(Long scriptId, Long userId) {
        // TODO: 实现获取脚本详情的逻辑
        return null;
    }

    @Override
    @Transactional
    public ApiResponse<ScriptResponse> updateScript(Long scriptId, CreateScriptRequest request, Long userId) {
        // TODO: 实现更新脚本的逻辑
        return null;
    }

    @Override
    @Transactional
    public void deleteScript(Long scriptId, Long userId) {
        // TODO: 实现删除脚本的逻辑
    }

    private ScriptResponse convertToResponse(Script script) {
        ScriptResponse response = new ScriptResponse()
                .setScriptId(script.getScriptId())
                .setTitle(script.getTitle())
                .setAlternativeTitle1(script.getAlternativeTitle1())
                .setDescription(script.getDescription())
                .setDifficulty(script.getDifficulty())
                .setStatus(script.getStatus())
                .setReleaseDate(script.getReleaseDate())
                .setUserId(script.getUserId())
                .setChannelId(script.getChannelId())
                .setCategoryId(script.getCategoryId())
                .setCreatedAt(script.getCreatedAt())
                .setUpdatedAt(script.getUpdatedAt());

        if (script.getChapters() != null) {
            response.setChapters(script.getChapters().stream()
                    .map(chapter -> new ScriptResponse.ChapterResponse()
                            .setChapterId(chapter.getChapterId())
                            .setChapterNumber(chapter.getChapterNumber())
                            .setTitle(chapter.getTitle())
                            .setContent(chapter.getContent())
                            .setCreatedAt(chapter.getCreatedAt())
                            .setUpdatedAt(chapter.getUpdatedAt()))
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private ScriptListItemResponse convertToListItemResponse(Script script, Long userId, Set<String> includeFields) {
        ScriptListItemResponse response = new ScriptListItemResponse()
                .setScriptId(script.getScriptId())
                .setTitle(script.getTitle())
                .setDescription(script.getDescription())
                .setStatus(script.getStatus())
                .setDifficulty(script.getDifficulty())
                .setReleaseDate(script.getReleaseDate())
                .setChaptersCount(script.getChapters() != null ? script.getChapters().size() : 0)
                .setCreatedAt(script.getCreatedAt())
                .setUpdatedAt(script.getUpdatedAt());

        // 添加频道信息
        if (script.getChannelId() != null) {
            var channelResponse = channelService.getChannelDetail(script.getChannelId(), userId);
            if (channelResponse.isSuccess()) {
                var channelData = channelResponse.getData();
                response.setChannel(new ScriptListItemResponse.ChannelInfo()
                        .setChannelId(channelData.getChannelId())
                        .setChannelName(channelData.getChannelName()));
            }
        }

        // 添加分类信息
        if (script.getCategoryId() != null && (includeFields.isEmpty() || includeFields.contains("category"))) {
            var categoryResponse = categoryService.getCategoryDetail(script.getCategoryId(), userId);
            if (categoryResponse.isSuccess()) {
                var categoryData = categoryResponse.getData();
                response.setCategory(new ScriptListItemResponse.CategoryInfo()
                        .setCategoryId(categoryData.getCategoryId())
                        .setCategoryName(categoryData.getCategoryName()));
            }
        }

        return response;
    }
} 