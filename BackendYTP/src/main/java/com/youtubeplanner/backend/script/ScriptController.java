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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/scripts")
@RequiredArgsConstructor
public class ScriptController {
    private final ScriptService scriptService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ScriptResponse> createScript(
            @Valid @RequestBody CreateScriptRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        return scriptService.createScript(request, userId);
    }

    @GetMapping
    public ApiResponse<PageResponse<ScriptListItemResponse>> getScripts(
            @ModelAttribute @Valid GetScriptsRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        return scriptService.getScripts(request, userId);
    }

    @GetMapping("/{scriptId}")
    public ApiResponse<ScriptResponse> getScriptDetail(
            @PathVariable Long scriptId,
            @RequestHeader("X-User-ID") Long userId) {
        return scriptService.getScriptDetail(scriptId, userId);
    }

    @PutMapping("/{scriptId}")
    public ApiResponse<ScriptResponse> updateScript(
            @PathVariable Long scriptId,
            @Valid @RequestBody CreateScriptRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        return scriptService.updateScript(scriptId, request, userId);
    }

    @DeleteMapping("/{scriptId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteScript(
            @PathVariable Long scriptId,
            @RequestHeader("X-User-ID") Long userId) {
        scriptService.deleteScript(scriptId, userId);
    }
} 