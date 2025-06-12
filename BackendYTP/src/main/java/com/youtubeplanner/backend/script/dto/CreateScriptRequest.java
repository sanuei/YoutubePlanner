package com.youtubeplanner.backend.script.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateScriptRequest {
    @NotBlank(message = "标题不能为空")
    @Size(max = 255, message = "标题长度不能超过255个字符")
    private String title;

    @JsonProperty("alternative_title1")
    @Size(max = 255, message = "备选标题长度不能超过255个字符")
    private String alternativeTitle1;

    private String description;

    @Min(value = 1, message = "难度等级最小为1")
    @Max(value = 5, message = "难度等级最大为5")
    private Integer difficulty;

    @Size(max = 50, message = "状态长度不能超过50个字符")
    private String status;

    @JsonProperty("release_date")
    private LocalDate releaseDate;

    @JsonProperty("channel_id")
    private Long channelId;

    @JsonProperty("category_id")
    private Long categoryId;

    @Valid
    private List<ChapterRequest> chapters;

    @Data
    public static class ChapterRequest {
        @JsonProperty("chapter_number")
        @NotNull(message = "章节编号不能为空")
        @Min(value = 1, message = "章节编号必须大于0")
        private Integer chapterNumber;

        @Size(max = 255, message = "章节标题长度不能超过255个字符")
        private String title;

        @NotBlank(message = "章节内容不能为空")
        private String content;
    }
} 