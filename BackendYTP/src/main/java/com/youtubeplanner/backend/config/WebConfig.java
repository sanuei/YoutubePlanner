/*
 * 文件名：WebConfig.java
 * 创建日期：2024年3月21日
 * 作者：[你的名字]
 * 
 * 文件描述：
 * Web 配置类，处理跨域请求配置等 Web 相关的全局配置。
 * 
 * 修改历史：
 * 2024年3月21日 - 初始版本
 * 2024年3月21日 - 添加多个 React 开发端口支持
 * 
 * 版权所有 (c) 2024 YoutubePlanner
 */

package com.youtubeplanner.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 匹配所有路径
                .allowedOriginPatterns("*") // 允许所有来源
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    
} 