package com.youtubeplanner.backend.script.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Accessors(chain = true)
public class ScriptListItemResponse {
    @JsonProperty("script_id")
    private Long scriptId;

    private String title;

    private String description;

    private String status;

    private Integer difficulty;

    @JsonProperty("release_date")
    private LocalDate releaseDate;

    private ChannelInfo channel;

    private CategoryInfo category;

    @JsonProperty("chapters_count")
    private Integer chaptersCount;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("updated_at")
    private Instant updatedAt;

    @Data
    @Accessors(chain = true)
    public static class ChannelInfo {
        @JsonProperty("channel_id")
        private Long channelId;

        @JsonProperty("channel_name")
        private String channelName;
    }

    @Data
    @Accessors(chain = true)
    public static class CategoryInfo {
        @JsonProperty("category_id")
        private Long categoryId;

        @JsonProperty("category_name")
        private String categoryName;
    }
} 