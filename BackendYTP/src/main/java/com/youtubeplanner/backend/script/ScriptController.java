package com.youtubeplanner.backend.script;

import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.script.dto.CreateScriptRequest;
import com.youtubeplanner.backend.script.dto.GetScriptsRequest;
import com.youtubeplanner.backend.script.dto.ScriptListItemResponse;
import com.youtubeplanner.backend.script.dto.ScriptResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        return Long.parseLong(authentication.getName());
    }
} 