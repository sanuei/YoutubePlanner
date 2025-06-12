package com.youtubeplanner.backend.script.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Data
public class GetScriptsRequest {
    @Min(1)
    private int page = 1;

    @Min(1)
    private int size = 10;

    @JsonProperty("channel_id")
    private Long channelId;

    @JsonProperty("category_id")
    private Long categoryId;

    private String status;

    @Min(value = 1, message = "难度最小为1")
    @Max(value = 5, message = "难度最大为5")
    private Integer difficulty;

    private String search;

    @JsonProperty("date_from")
    private LocalDate dateFrom;

    @JsonProperty("date_to")
    private LocalDate dateTo;

    @JsonProperty("sort_by")
    @Pattern(regexp = "^(title|created_at|updated_at|release_date)?$", message = "排序字段必须是 title、created_at、updated_at 或 release_date")
    private String sortBy = "created_at";

    @Pattern(regexp = "^(asc|desc)?$", message = "排序方向必须是 asc 或 desc")
    private String order = "desc";

    private Set<String> includeFields = new HashSet<>();

    public Set<String> getIncludeFields() {
        if (includeFields.isEmpty()) {
            return new HashSet<>();
        }
        return includeFields;
    }

    public PageRequest toPageRequest() {
        // 将页码转换为从0开始
        int pageIndex = page - 1;
        
        // 验证并转换排序字段
        String sortField = switch (sortBy) {
            case "title" -> "title";
            case "created_at" -> "createdAt";
            case "updated_at" -> "updatedAt";
            case "release_date" -> "releaseDate";
            default -> "createdAt";
        };

        // 创建排序对象
        Sort sort = Sort.by(
            "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC,
            sortField
        );

        return PageRequest.of(pageIndex, size, sort);
    }
} 