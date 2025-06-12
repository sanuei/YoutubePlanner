package com.youtubeplanner.backend.script;

import com.youtubeplanner.backend.channel.ChannelService;
import com.youtubeplanner.backend.category.CategoryService;
import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.script.dto.CreateScriptRequest;
import com.youtubeplanner.backend.script.dto.GetScriptsRequest;
import com.youtubeplanner.backend.script.dto.ScriptListItemResponse;
import com.youtubeplanner.backend.script.dto.ScriptResponse;
import com.youtubeplanner.backend.script.entity.Script;
import com.youtubeplanner.backend.script.entity.ScriptChapter;
import com.youtubeplanner.backend.script.repository.ScriptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptService {
    private final ScriptRepository scriptRepository;
    private final ChannelService channelService;
    private final CategoryService categoryService;

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

        Script savedScript = scriptRepository.save(script);
        return ApiResponse.created(convertToResponse(savedScript));
    }

    @Transactional(readOnly = true)
    public ApiResponse<PageResponse<ScriptListItemResponse>> getScripts(GetScriptsRequest request, Long userId) {
        Page<Script> scriptPage = scriptRepository.findByUserIdAndFilters(
                userId,
                request.getChannelId(),
                request.getCategoryId(),
                request.getStatus(),
                request.getDifficulty(),
                request.getDateFrom(),
                request.getDateTo(),
                request.getSearch(),
                request.toPageRequest()
        );

        Page<ScriptListItemResponse> responsePage = scriptPage.map(script -> 
            convertToListItemResponse(script, userId, request.getIncludeFields()));
        return ApiResponse.success(PageResponse.of(responsePage));
    }

    @Transactional(readOnly = true)
    public ApiResponse<ScriptResponse> getScriptDetail(Long scriptId, Long userId) {
        Script script = scriptRepository.findById(scriptId)
                .orElse(null);

        if (script == null) {
            return ApiResponse.error(404, "脚本不存在");
        }

        if (!script.getUserId().equals(userId)) {
            return ApiResponse.error(403, "无权限访问该脚本");
        }

        return ApiResponse.success(convertToResponse(script));
    }

    @Transactional
    public ApiResponse<ScriptResponse> updateScript(Long scriptId, CreateScriptRequest request, Long userId) {
        Script script = scriptRepository.findById(scriptId)
                .orElse(null);

        if (script == null) {
            return ApiResponse.error(404, "脚本不存在");
        }

        if (!script.getUserId().equals(userId)) {
            return ApiResponse.error(403, "无权限访问该脚本");
        }

        // 验证频道权限
        if (request.getChannelId() != null) {
            var channelResponse = channelService.getChannelDetail(request.getChannelId(), userId);
            if (!channelResponse.isSuccess()) {
                return ApiResponse.error(403, "无权限访问该频道");
            }
        }

        // 更新基本信息
        if (request.getTitle() != null) script.setTitle(request.getTitle());
        if (request.getAlternativeTitle1() != null) script.setAlternativeTitle1(request.getAlternativeTitle1());
        if (request.getDescription() != null) script.setDescription(request.getDescription());
        if (request.getDifficulty() != null) script.setDifficulty(request.getDifficulty());
        if (request.getStatus() != null) script.setStatus(request.getStatus());
        if (request.getReleaseDate() != null) script.setReleaseDate(request.getReleaseDate());
        if (request.getChannelId() != null) script.setChannelId(request.getChannelId());
        if (request.getCategoryId() != null) script.setCategoryId(request.getCategoryId());

        // 处理章节更新
        if (request.getChapters() != null) {
            // 获取现有章节
            Map<Integer, ScriptChapter> existingChapters = script.getChapters().stream()
                    .collect(Collectors.toMap(ScriptChapter::getChapterNumber, chapter -> chapter));

            // 验证章节编号唯一性
            Set<Integer> chapterNumbers = new HashSet<>();
            for (var chapter : request.getChapters()) {
                if (!chapterNumbers.add(chapter.getChapterNumber())) {
                    return ApiResponse.error(409, "章节编号重复");
                }
            }

            // 更新或创建章节
            Set<ScriptChapter> updatedChapters = request.getChapters().stream()
                    .map(chapterRequest -> {
                        ScriptChapter chapter = existingChapters.get(chapterRequest.getChapterNumber());
                        if (chapter == null) {
                            // 创建新章节
                            chapter = new ScriptChapter()
                                    .setScript(script)
                                    .setChapterNumber(chapterRequest.getChapterNumber());
                        }
                        if (chapterRequest.getTitle() != null) chapter.setTitle(chapterRequest.getTitle());
                        if (chapterRequest.getContent() != null) chapter.setContent(chapterRequest.getContent());
                        return chapter;
                    })
                    .collect(Collectors.toSet());

            // 清除原有章节集合并添加新章节
            script.getChapters().clear();
            script.getChapters().addAll(updatedChapters);
        }

        Script updatedScript = scriptRepository.save(script);
        return ApiResponse.success(convertToResponse(updatedScript));
    }

    @Transactional
    public void deleteScript(Long scriptId, Long userId) {
        Script script = scriptRepository.findById(scriptId)
                .orElse(null);

        if (script == null) {
            throw new RuntimeException("脚本不存在");
        }

        if (!script.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除该脚本");
        }

        scriptRepository.delete(script);
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