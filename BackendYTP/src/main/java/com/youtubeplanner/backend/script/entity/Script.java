package com.youtubeplanner.backend.script.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "scripts")
@Accessors(chain = true)
public class Script {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "script_id")
    private Long scriptId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "alternative_title1", length = 255)
    private String alternativeTitle1;

    @Column(columnDefinition = "text")
    private String description;

    private Integer difficulty;

    @Column(length = 50)
    private String status;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "channel_id")
    private Long channelId;

    @Column(name = "category_id")
    private Long categoryId;

    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScriptChapter> chapters = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
} 