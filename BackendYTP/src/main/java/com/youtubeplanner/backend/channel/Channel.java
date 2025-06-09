/*
 * 文件名：Channel.java
 * 创建日期：2024年3月19日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * Channel实体类，对应数据库中的channels表。
 * 用于存储YouTube频道的基本信息，包括频道名称、创建者、创建时间等。
 * 实现了软删除功能，deleted字段标记删除状态。
 * 
 * 修改历史：
 * 2024年3月19日 - 初始版本
 * 2024年3月20日 - 添加软删除功能
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.channel;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.Instant;

@Entity
@Table(name = "channels", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "channel_name"}, name = "uq_user_channel_name")
})
@SQLDelete(sql = "UPDATE channels SET deleted = true WHERE channel_id = ?") // 软删除SQL
@Where(clause = "deleted = false") // 查询时自动过滤已删除的记录
@Data
public class Channel {
    // 频道ID，主键，自增
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "channel_id")
    @JsonProperty("channel_id")
    private Long channelId;

    // 频道名称，必填，长度1-100
    @NotBlank(message = "频道名称不能为空")
    @Size(min = 1, max = 100, message = "频道名称长度必须在1-100字符之间")
    @Column(name = "channel_name", nullable = false, columnDefinition = "VARCHAR(255)")
    @JsonProperty("channel_name")
    private String channelName;

    // 用户ID，必填，关联创建者
    @Column(name = "user_id", nullable = false)
    @JsonProperty("user_id")
    private Long userId;

    // 创建时间，自动生成
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonProperty("created_at")
    private Instant createdAt;

    // 软删除标记
    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;
} 