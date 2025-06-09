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
        registry.addMapping("/api/**") // 匹配所有 /api 开头的路径
                .allowedOrigins(
                    "http://localhost:3000",  // React 默认端口
                    "http://localhost:3001",  // React 备用端口
                    "http://localhost:4200",  // Angular 默认端口
                    "http://localhost:8080",  // Vue 默认端口
                    "http://localhost:5173",  // Vite 默认端口
                    "http://127.0.0.1:3000",  // React IP 访问（3000）
                    "http://127.0.0.1:3001",  // React IP 访问（3001）
                    "http://127.0.0.1:5173"   // Vite IP 访问
                ) 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的 HTTP 方法
                .allowedHeaders("*") // 允许所有请求头
                .exposedHeaders("*") // 允许前端访问的响应头
                .allowCredentials(true) // 允许发送认证信息（cookies等）
                .maxAge(3600); // 预检请求的缓存时间（秒）
    }

    
} 