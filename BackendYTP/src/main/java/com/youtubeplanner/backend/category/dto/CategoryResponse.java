package com.youtubeplanner.backend.category.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.ZonedDateTime;

@Data
@Accessors(chain = true)
public class CategoryResponse {
    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("category_name")
    private String categoryName;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("created_at")
    private ZonedDateTime createdAt;
} 