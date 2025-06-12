package com.youtubeplanner.backend.script.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

@Data
public class GetScriptsRequest {
    @Min(value = 1, message = "页码最小为1")
    private Integer page = 1;

    @Min(value = 1, message = "每页数量最小为1")
    @Max(value = 100, message = "每页数量最大为100")
    private Integer limit = 10;

    @JsonProperty("channel_id")
    private Long channelId;

    @JsonProperty("category_id")
    private Long categoryId;

    private String status;

    @Pattern(regexp = "^(EASY|MEDIUM|HARD)?$", message = "难度必须是 EASY、MEDIUM 或 HARD")
    private String difficulty;

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

        return PageRequest.of(pageIndex, limit, sort);
    }
} 