package com.youtubeplanner.backend.script.service;

import com.youtubeplanner.backend.common.ApiResponse;
import com.youtubeplanner.backend.common.PageResponse;
import com.youtubeplanner.backend.script.dto.CreateScriptRequest;
import com.youtubeplanner.backend.script.dto.GetScriptsRequest;
import com.youtubeplanner.backend.script.dto.ScriptListItemResponse;
import com.youtubeplanner.backend.script.dto.ScriptResponse;

public interface ScriptService {
    ApiResponse<ScriptResponse> createScript(CreateScriptRequest request, Long userId);
    
    ApiResponse<PageResponse<ScriptListItemResponse>> getScripts(GetScriptsRequest request, Long userId);
    
    ApiResponse<ScriptResponse> getScriptDetail(Long scriptId, Long userId);
    
    ApiResponse<ScriptResponse> updateScript(Long scriptId, CreateScriptRequest request, Long userId);
    
    void deleteScript(Long scriptId, Long userId);
} 