# YouTube 规划器后端服务

## 项目简介

YouTube规划器是一个专业的视频内容规划和管理平台，本仓库包含其后端服务实现。该服务提供了完整的RESTful API，支持频道管理、脚本管理、分类管理等核心功能，帮助内容创作者更好地规划和制作YouTube视频内容。

## 技术架构

### 核心框架
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- MyBatis

### 数据存储
- PostgreSQL (Supabase托管)
- JPA/Hibernate
- MyBatis

### 安全认证
- JWT (JSON Web Token)
- Spring Security
- 密码加密

### 开发工具
- Lombok
- Spring Boot DevTools
- Maven

## 系统要求

- JDK 17+
- Maven 3.6+
- PostgreSQL 14+

## 快速开始

### 1. 环境准备
```bash
# 克隆项目
git clone [repository-url]
cd BackendYTP

# 检查Java版本
java -version  # 确保版本 >= 17
```

### 2. 配置数据库
项目使用Supabase托管的PostgreSQL数据库。数据库连接信息已在`application.properties`中配置。

### 3. 构建项目
```bash
# 清理并构建
mvn clean install

# 运行应用
mvn spring-boot:run
```

应用将在`http://localhost:8080`启动

## 项目特性

### 核心功能
- 用户认证与授权
- 频道管理
- 脚本管理
- 分类管理
- 章节管理

### 技术特性
- RESTful API设计
- JWT认证
- 数据验证
- 软删除支持
- 分页查询
- 统一响应格式
- 全局异常处理

## API文档

### 基础信息
- 基础URL：`http://localhost:8080/api/v1`
- API版本：v1
- 认证方式：Bearer Token (JWT)
- 数据格式：JSON
- 字符编码：UTF-8

### 统一响应格式
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 主要API模块

#### 1. 认证模块
- 用户注册
- 用户登录
- 令牌刷新
- 用户登出

#### 2. 频道管理
- 创建频道
- 获取频道列表
- 获取频道详情
- 更新频道
- 删除频道

#### 3. 脚本管理
- 创建脚本
- 获取脚本列表
- 获取脚本详情
- 更新脚本
- 删除脚本

#### 4. 分类管理
- 创建分类
- 获取分类列表
- 获取分类详情
- 更新分类
- 删除分类

## 数据库设计

### 核心表结构
- Users：用户信息
- Channels：频道信息
- Scripts：脚本信息
- Categories：分类信息
- Chapters：章节信息

## 开发指南

### 代码规范
- 遵循阿里巴巴Java开发手册
- 使用Lombok简化代码
- 统一的异常处理
- 规范的注释风格

### 分支管理
- main：主分支
- develop：开发分支
- feature/*：功能分支
- hotfix/*：紧急修复分支

## 部署说明

### 环境要求
- JDK 17+
- PostgreSQL 14+
- 2GB+ RAM
- 20GB+ 磁盘空间
- Docker 20.10+ (可选，用于容器化部署)

### 部署步骤

#### 1. 传统部署
1. 构建项目
```bash
mvn clean package
```

2. 配置数据库
3. 配置环境变量
4. 启动应用
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

#### 2. Docker部署

##### 构建Docker镜像
```bash
# 清理并构建项目
mvn clean package

# 构建Docker镜像
mvn dockerfile:build
```

##### 运行Docker容器

开发环境：
```bash
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=OtvO9P8X36b3up5x \
  --name youtube-planner-dev \
  youtube-planner:0.0.1-SNAPSHOT
```

生产环境：
```bash
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=your_prod_db_url \
  -e DB_USERNAME=your_prod_username \
  -e DB_PASSWORD=your_prod_password \
  -e JWT_SECRET=your_jwt_secret \
  --name youtube-planner-prod \
  youtube-planner:0.0.1-SNAPSHOT
```

##### 容器管理命令
```bash
# 查看容器日志
docker logs -f youtube-planner-dev

# 停止容器
docker stop youtube-planner-dev

# 删除容器
docker rm youtube-planner-dev

# 查看容器状态
docker ps -a
```

##### 环境变量说明
| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| SPRING_PROFILES_ACTIVE | 激活的配置文件 | dev/prod |
| DB_URL | 数据库连接URL | jdbc:postgresql://host:5432/dbname |
| DB_USERNAME | 数据库用户名 | postgres |
| DB_PASSWORD | 数据库密码 | your_password |
| JWT_SECRET | JWT密钥 | your_secret_key |

##### 注意事项
1. 生产环境部署时请确保：
   - 使用强密码
   - 配置适当的JVM参数
   - 设置正确的时区
   - 配置日志轮转
   - 启用HTTPS

2. 容器化部署优势：
   - 环境一致性
   - 快速部署
   - 资源隔离
   - 易于扩展
   - 版本控制

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 发起Pull Request

## 许可证

Copyright © 2024 YouTube规划器 