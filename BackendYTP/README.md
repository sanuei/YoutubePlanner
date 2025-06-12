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

### 脚本管理

#### 创建脚本
- **POST** `/scripts`
- **请求头**：
  - `X-User-ID`：用户ID（Long）
  - `Content-Type`：application/json

**请求体**：
```json
{
  "title": "我的第一个影片脚本",
  "alternative_title1": "备选标题",
  "description": "脚本描述",
  "difficulty": 3,
  "status": "Scripting",
  "release_date": "2025-12-31",
  "channel_id": 1,
  "category_id": 2,
  "chapters": [
    {
      "chapter_number": 1,
      "title": "第一章",
      "content": "第一章内容"
    },
    {
      "chapter_number": 2,
      "title": "第二章",
      "content": "第二章内容"
    }
  ]
}
```

**字段验证**：
- `title`：必填，1-255字符
- `alternative_title1`：可选，最大255字符
- `description`：可选，文本
- `difficulty`：可选，整数1-5
- `status`：可选，字符串，最大50字符
- `release_date`：可选，日期格式YYYY-MM-DD
- `channel_id`：可选，整数，必须是用户拥有的频道
- `category_id`：可选，整数，必须是用户拥有的分类
- `chapters`：可选，数组
    - `chapter_number`：必填，整数，大于0，同一脚本下唯一
    - `title`：可选，最大255字符
    - `content`：必填，文本

**成功响应** (201)：
```json
{
  "success": true,
  "code": 201,
  "message": "脚本创建成功",
  "data": {
    "script_id": 1,
    "title": "我的第一个影片脚本",
    "alternative_title1": "备选标题",
    "description": "脚本描述",
    "difficulty": 3,
    "status": "Scripting",
    "release_date": "2025-12-31",
    "user_id": 1,
    "channel_id": 1,
    "category_id": 2,
    "chapters": [
      {
        "chapter_id": 1,
        "chapter_number": 1,
        "title": "第一章",
        "content": "第一章内容",
        "created_at": "2025-06-06T10:00:00Z",
        "updated_at": "2025-06-06T10:00:00Z"
      },
      {
        "chapter_id": 2,
        "chapter_number": 2,
        "title": "第二章",
        "content": "第二章内容",
        "created_at": "2025-06-06T10:00:00Z",
        "updated_at": "2025-06-06T10:00:00Z"
      }
    ],
    "created_at": "2025-06-06T10:00:00Z",
    "updated_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 400：参数验证失败
- 403：无权限访问频道或分类
- 404：频道或分类不存在
- 409：章节编号重复

#### 获取脚本列表

获取当前用户的脚本列表，支持分页、筛选和排序。

**请求信息：**
- 请求方法：GET
- 请求路径：/api/v1/scripts
- 请求头：
  - X-User-ID: 用户ID（必填）

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认1 |
| limit | Integer | 否 | 每页数量，默认10，最大100 |
| channel_id | Long | 否 | 频道ID，按频道筛选 |
| category_id | Long | 否 | 分类ID，按分类筛选 |
| status | String | 否 | 状态，按状态筛选 |
| difficulty | String | 否 | 难度，可选值：EASY、MEDIUM、HARD |
| search | String | 否 | 搜索关键词，匹配标题和描述 |
| date_from | Date | 否 | 开始日期，格式：YYYY-MM-DD |
| date_to | Date | 否 | 结束日期，格式：YYYY-MM-DD |
| sort_by | String | 否 | 排序字段，可选值：title、created_at、updated_at、release_date，默认created_at |
| order | String | 否 | 排序方向，可选值：asc、desc，默认desc |

**成功响应：**
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "items": [
            {
                "script_id": 1,
                "title": "示例脚本",
                "description": "这是一个示例脚本",
                "status": "DRAFT",
                "difficulty": 2,
                "release_date": "2024-06-12",
                "channel": {
                    "channel_id": 1,
                    "channel_name": "示例频道"
                },
                "category": {
                    "category_id": 1,
                    "category_name": "示例分类"
                },
                "chapters_count": 5,
                "created_at": "2024-06-12T08:43:45.736Z",
                "updated_at": "2024-06-12T08:43:45.736Z"
            }
        ]
    }
}
```

**错误响应：**
- 400 Bad Request：请求参数错误
- 401 Unauthorized：未提供用户ID
- 500 Internal Server Error：服务器内部错误

#### 获取脚本详情
- **GET** `/api/v1/scripts/{script_id}`
- **请求头**：
  - `X-User-ID`：用户ID（Long）

**路径参数**：
- `script_id`：必填，脚本ID（Long）

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "获取脚本详情成功",
  "data": {
    "script_id": 1,
    "title": "我的第一个影片脚本",
    "alternative_title1": "备选标题",
    "description": "脚本描述",
    "difficulty": 3,
    "status": "Scripting",
    "release_date": "2025-12-31",
    "user_id": 1,
    "channel_id": 1,
    "category_id": 2,
    "channel": {
      "channel_id": 1,
      "channel_name": "我的第一个频道"
    },
    "category": {
      "category_id": 2,
      "category_name": "教程"
    },
    "chapters": [
      {
        "chapter_id": 1,
        "chapter_number": 1,
        "title": "第一章",
        "content": "第一章内容",
        "created_at": "2025-06-06T10:00:00Z",
        "updated_at": "2025-06-06T10:00:00Z"
      },
      {
        "chapter_id": 2,
        "chapter_number": 2,
        "title": "第二章",
        "content": "第二章内容",
        "created_at": "2025-06-06T10:00:00Z",
        "updated_at": "2025-06-06T10:00:00Z"
      }
    ],
    "created_at": "2025-06-06T10:00:00Z",
    "updated_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 403：无权限访问该脚本
- 404：脚本不存在

#### 更新脚本
- **PUT** `/api/v1/scripts/{script_id}`
- **请求头**：
  - `X-User-ID`：用户ID（Long）
  - `Content-Type`：application/json

**路径参数**：
- `script_id`：必填，脚本ID（Long）

**请求体**：
```json
{
  "title": "更新后的标题",
  "status": "Review",
  "chapters": [
    {
      "chapter_id": 1,
      "chapter_number": 1,
      "title": "更新后的第一章",
      "content": "更新后的第一章内容"
    },
    {
      "chapter_number": 3,
      "title": "新第三章",
      "content": "新第三章内容"
    }
  ]
}
```

**字段验证**：
- 支持部分更新，字段同创建接口
- `chapters`：可选，数组
    - `chapter_id`：可选，整数，用于更新现有章节
    - `chapter_number`：必填，整数，大于0，同一脚本下唯一
    - `title`：可选，最大255字符
    - `content`：必填，文本

**更新逻辑**：
- 若提供`chapter_id`，更新对应章节
- 若无`chapter_id`，创建新章节
- 未列出的现有章节保持不变

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "脚本更新成功",
  "data": {
    "script_id": 1,
    "title": "更新后的标题",
    "alternative_title1": "备选标题",
    "description": "脚本描述",
    "difficulty": 3,
    "status": "Review",
    "release_date": "2025-12-31",
    "user_id": 1,
    "channel_id": 1,
    "category_id": 2,
    "chapters": [
      {
        "chapter_id": 1,
        "chapter_number": 1,
        "title": "更新后的第一章",
        "content": "更新后的第一章内容",
        "created_at": "2025-06-06T10:00:00Z",
        "updated_at": "2025-06-06T12:00:00Z"
      },
      {
        "chapter_id": 2,
        "chapter_number": 2,
        "title": "第二章",
        "content": "第二章内容",
        "created_at": "2025-06-06T10:00:00Z",
        "updated_at": "2025-06-06T10:00:00Z"
      },
      {
        "chapter_id": 3,
        "chapter_number": 3,
        "title": "新第三章",
        "content": "新第三章内容",
        "created_at": "2025-06-06T12:00:00Z",
        "updated_at": "2025-06-06T12:00:00Z"
      }
    ],
    "created_at": "2025-06-06T10:00:00Z",
    "updated_at": "2025-06-06T12:00:00Z"
  },
  "timestamp": "2025-06-06T12:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 400：参数验证失败
- 403：无权限访问该脚本
- 404：脚本或章节不存在
- 409：章节编号重复

#### 删除脚本
- **DELETE** `/api/v1/scripts/{script_id}`
- **请求头**：
  - `X-User-ID`：用户ID（Long）

**路径参数**：
- `script_id`：必填，脚本ID（Long）

**成功响应** (204)：
无响应体

**错误响应**：
- 403：无权限删除该脚本
- 404：脚本不存在

**删除策略**：
- 硬删除，级联删除关联的章节

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