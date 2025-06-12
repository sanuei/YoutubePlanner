# YouTube 规划器后端服务

这是一个基于 Spring Boot 构建的 YouTube 规划器应用后端服务。

## 技术栈

- Spring Boot 3.2.3
- Spring Data JPA
- PostgreSQL 数据库
- Project Lombok
- Spring Boot DevTools

## 系统要求

- Java 17 或更高版本
- Maven 3.6.x 或更高版本
- PostgreSQL 数据库

## 快速开始

1. 克隆仓库：
```bash
git clone [repository-url]
cd BackendYTP
```

2. 配置数据库：
应用使用 Supabase 托管的 PostgreSQL 数据库。连接信息已在 `application.properties` 中配置。

3. 构建项目：
```bash
mvn clean install
```

4. 运行应用：
```bash
mvn spring-boot:run
```

应用将在 `http://localhost:8080` 启动

## 项目特性

- RESTful API 接口
- PostgreSQL 数据库集成（支持软删除）
- JPA/Hibernate 数据持久化
- Spring Boot DevTools 开发工具
- Lombok 减少样板代码

## API 文档

### 基础信息
- 基础 URL：`http://localhost:8080/api/v1`
- API 版本：v1
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
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 错误响应格式
```json
{
  "success": false,
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "username",
      "message": "用户名不能为空"
    }
  ],
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

## API 端点

### 频道管理

#### 创建频道
- **POST** `/channels`
- **请求头**：
  - `X-User-ID`：用户ID（Long）
  - `Content-Type`：application/json

**请求体**：
```json
{
  "channel_name": "我的第一个频道"
}
```

**字段验证**：
- `channel_name`：必填，1-100字符，每个用户唯一

**成功响应** (201)：
```json
{
  "success": true,
  "code": 201,
  "message": "频道创建成功",
  "data": {
    "channel_id": 1,
    "channel_name": "我的第一个频道",
    "user_id": 1,
    "created_at": "2024-03-19T10:00:00Z"
  },
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 400：参数验证失败
- 409：频道名称已存在

#### 获取频道列表
- **GET** `/channels`
- **请求头**：
  - `X-User-ID`：用户ID（Long）

**查询参数**：
- `page`：页码，默认1
- `limit`：每页数量，默认10，最大100
- `search`：搜索关键词
- `sort_by`：排序字段（channel_name, created_at），默认created_at
- `order`：排序方向（asc, desc），默认desc

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "获取频道列表成功",
  "data": {
    "items": [
      {
        "channel_id": 1,
        "channel_name": "我的第一个频道",
        "user_id": 1,
        "created_at": "2024-03-19T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

#### 获取频道详情
- **GET** `/channels/{channel_id}`
- **请求头**：
  - `X-User-ID`：用户ID（Long）

**路径参数**：
- `channel_id`：必填，频道ID（Long）

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "获取频道详情成功",
  "data": {
    "channel_id": 1,
    "channel_name": "我的第一个频道",
    "user_id": 1,
    "created_at": "2024-03-19T10:00:00Z",
    "scripts_count": 5
  },
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 404：频道不存在

#### 更新频道
- **PUT** `/channels/{channel_id}`
- **请求头**：
  - `X-User-ID`：用户ID（Long）
  - `Content-Type`：application/json

**路径参数**：
- `channel_id`：必填，频道ID（Long）

**请求体**：
```json
{
  "channel_name": "更新后的频道名称"
}
```

**字段验证**：
- `channel_name`：必填，1-100字符，每个用户唯一

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "更新成功",
  "data": {
    "channel_id": 1,
    "channel_name": "更新后的频道名称",
    "user_id": 1,
    "created_at": "2024-03-19T10:00:00Z"
  },
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 404：频道不存在
- 409：频道名称已存在

#### 删除频道
- **DELETE** `/channels/{channel_id}`
- **请求头**：
  - `X-User-ID`：用户ID（Long）

**路径参数**：
- `channel_id`：必填，频道ID（Long）

**成功响应** (204)：
无响应体

**错误响应**：
- 404：频道不存在

**删除策略**：
- 采用软删除，保留数据但标记为已删除
- 关联的脚本不会被删除，但会解除与频道的关联

## 数据库设计

### Channels 表
```sql
CREATE TABLE Channels (
    channel_id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_channel_name UNIQUE (user_id, channel_name)
);
``` 