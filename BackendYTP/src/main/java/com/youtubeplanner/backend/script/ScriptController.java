/*
 * 文件名：ScriptController.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * 脚本控制器，处理脚本相关的HTTP请求。
 * 包括创建、查询、更新和删除脚本的功能。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.script;

import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.script.dto.CreateScriptRequest;
import com.youtubeplanner.backend.script.dto.GetScriptsRequest;
import com.youtubeplanner.backend.script.dto.ScriptListItemResponse;
import com.youtubeplanner.backend.script.dto.ScriptResponse;
import com.youtubeplanner.backend.script.service.ScriptService;
import com.youtubeplanner.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/scripts")
@RequiredArgsConstructor
public class ScriptController {
    private final ScriptService scriptService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ScriptResponse> createScript(
            @Valid @RequestBody CreateScriptRequest request) {
        return scriptService.createScript(request, getUserIdFromContext());
    }

    @GetMapping
    public ApiResponse<PageResponse<ScriptListItemResponse>> getScripts(
            @ModelAttribute @Valid GetScriptsRequest request) {
        return scriptService.getScripts(request, getUserIdFromContext());
    }

    @GetMapping("/test")
    public ApiResponse<Map<String, Object>> testDatabase() {
        Map<String, Object> testResult = new HashMap<>();
        testResult.put("userId", getUserIdFromContext());
        testResult.put("message", "数据库连接测试");
        testResult.put("timestamp", System.currentTimeMillis());
        return ApiResponse.success(testResult);
    }

    @GetMapping("/{scriptId}")
    public ApiResponse<ScriptResponse> getScriptDetail(
            @PathVariable Long scriptId) {
        return scriptService.getScriptDetail(scriptId, getUserIdFromContext());
    }

    @PutMapping("/{scriptId}")
    public ApiResponse<ScriptResponse> updateScript(
            @PathVariable Long scriptId,
            @Valid @RequestBody CreateScriptRequest request) {
        return scriptService.updateScript(scriptId, request, getUserIdFromContext());
    }

    @DeleteMapping("/{scriptId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteScript(
            @PathVariable Long scriptId) {
        scriptService.deleteScript(scriptId, getUserIdFromContext());
    }

    private Long getUserIdFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("用户未认证");
        }
        com.youtubeplanner.backend.user.entity.User user = (com.youtubeplanner.backend.user.entity.User) authentication.getPrincipal();
        return user.getUserId();
    }
} 