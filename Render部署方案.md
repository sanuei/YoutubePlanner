# YouTube Planner - Render部署方案

## 项目概述

YouTube Planner是一个前后端分离的Web应用，用于管理YouTube频道和视频内容。

### 技术栈

**前端 (frontendytp)**
- React 18.2.0 + TypeScript
- Material-UI (MUI) 7.x
- React Router 6.30.1
- Axios 用于API调用
- 构建工具：React Scripts

**后端 (BackendYTP)**
- Spring Boot 3.2.3 (Java 17)
- Spring Data JPA + MyBatis
- PostgreSQL 数据库 (Supabase)
- Spring Security + JWT认证
- Maven 构建工具

## 部署架构

### 选择方案：分离部署（推荐）

- **后端**：部署为Render Web Service
- **前端**：部署为Render Static Site
- **数据库**：继续使用Supabase PostgreSQL

### 架构优势

1. 前后端可以独立更新和扩展
2. 前端可以使用Render的CDN加速
3. 更符合微服务架构理念
4. 成本更低（前端静态托管免费）

## Docker容器化策略

### 后端容器化

```dockerfile
# 多阶段构建
FROM openjdk:17-jdk-slim AS builder
# Maven构建阶段

FROM openjdk:17-jre-slim AS runtime
# 运行时环境
EXPOSE 8080
```

**特点：**
- 多阶段构建减少镜像大小
- 第一阶段：Maven构建环境
- 第二阶段：运行时环境
- 配置健康检查

### 前端容器化

```dockerfile
# Node.js构建 + Nginx服务
FROM node:18-alpine AS builder
# React构建阶段

FROM nginx:alpine AS runtime
# 静态文件服务
EXPOSE 80
```

**特点：**
- 第一阶段：Node.js构建环境
- 第二阶段：Nginx服务器提供静态文件
- 配置路由重定向支持SPA

## 环境配置

### 数据库配置
- 保持现有Supabase PostgreSQL连接
- 通过环境变量管理敏感信息
- 考虑为生产环境创建独立数据库实例

### 关键环境变量

**后端：**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=***
JWT_SECRET=***
SERVER_PORT=8080
```

**前端：**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api/v1
```

## 部署流程

### 第一阶段：后端部署

1. 创建后端Dockerfile
2. 配置环境变量
3. 在Render创建Web Service
4. 连接GitHub仓库实现自动部署
5. 验证API功能

### 第二阶段：前端部署

1. 创建前端Dockerfile（可选，也可用Static Site）
2. 配置API端点指向后端服务
3. 在Render创建Static Site或Web Service
4. 设置构建命令和输出目录
5. 验证前端功能

### 第三阶段：服务连接

1. 配置CORS允许前端域名
2. 更新前端API配置
3. 端到端测试
4. 性能优化

## 成本优化

### 免费额度利用
- 前端：Static Site（免费）
- 后端：Web Service（免费750小时/月）
- 数据库：现有Supabase（免费额度）

### 性能优化
- 前端启用Gzip压缩
- 后端JVM参数优化
- 数据库连接池配置
- 静态资源CDN加速

## 监控与维护

### 日志管理
- 结构化日志输出
- Render日志查看功能
- 错误监控和告警

### 健康检查
- Spring Boot Actuator端点
- 前端服务状态检查
- 数据库连接状态

### 备份策略
- 数据库定期备份
- 代码版本控制
- 配置文件备份

## 部署清单

### 需要创建的文件

**后端：**
- [ ] `BackendYTP/Dockerfile`
- [ ] `BackendYTP/.dockerignore`
- [ ] `BackendYTP/src/main/resources/application-prod.properties`

**前端：**
- [ ] `frontendytp/Dockerfile`
- [ ] `frontendytp/.dockerignore`
- [ ] `frontendytp/.env.production`

**根目录：**
- [ ] `docker-compose.yml`（本地测试用）
- [ ] `render.yaml`（Render配置）

### Render服务配置

**后端Web Service：**
- Runtime: Docker
- Build Command: `docker build -t backend ./BackendYTP`
- Start Command: `java -jar app.jar`
- Environment Variables: 配置数据库连接等

**前端Static Site：**
- Build Command: `cd frontendytp && npm ci && npm run build`
- Publish Directory: `frontendytp/build`
- 或使用Docker Web Service

## 实施时间表

1. **第1天**：创建Docker文件和配置
2. **第2天**：后端部署和测试
3. **第3天**：前端部署和集成
4. **第4天**：端到端测试和优化
5. **第5天**：监控配置和文档完善

## 风险和应对

### 潜在风险
1. 数据库连接配置问题
2. CORS跨域问题
3. 环境变量配置错误
4. 构建时间过长

### 应对策略
1. 详细的配置文档和检查清单
2. 分阶段测试和部署
3. 回滚计划和备份策略
4. 性能监控和优化

---

**创建时间：** 2024年12月
**更新时间：** 2024年12月
**状态：** ✅ 实施完成 