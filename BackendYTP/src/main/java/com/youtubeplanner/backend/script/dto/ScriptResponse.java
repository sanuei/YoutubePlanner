package com.youtubeplanner.backend.script.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@Accessors(chain = true)
public class ScriptResponse {
    @JsonProperty("script_id")
    private Long scriptId;

    private String title;

    @JsonProperty("alternative_title1")
    private String alternativeTitle1;

    private String description;

    private Integer difficulty;

    private String status;

    @JsonProperty("release_date")
    private LocalDate releaseDate;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("channel_id")
    private Long channelId;

    @JsonProperty("category_id")
    private Long categoryId;

    private List<ChapterResponse> chapters;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("updated_at")
    private Instant updatedAt;

    @Data
    @Accessors(chain = true)
    public static class ChapterResponse {
        @JsonProperty("chapter_id")
        private Long chapterId;

        @JsonProperty("chapter_number")
        private Integer chapterNumber;

        private String title;

        private String content;

        @JsonProperty("created_at")
        private Instant createdAt;

        @JsonProperty("updated_at")
        private Instant updatedAt;
    }
} 