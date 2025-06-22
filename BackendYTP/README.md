# YouTube 规划器后端服务

这是一个基于 Spring Boot 构建的 YouTube 智能内容创作管理系统后端服务，集成AI文案生成、思维导图管理、RBAC权限控制等先进功能。

## 技术栈

- Spring Boot 3.2.3
- Spring Security + JWT + RBAC
- Spring Data JPA + MyBatis
- PostgreSQL 15 数据库
- Flyway 数据库迁移
- Project Lombok
- Spring Boot DevTools

## 系统要求

- Java 17 或更高版本
- Maven 3.6.x 或更高版本
- PostgreSQL 15 数据库

## 快速开始

1. 克隆仓库：
```bash
git clone [repository-url]
cd BackendYTP
```

2. 配置数据库：
应用使用 PostgreSQL 数据库。连接信息已在 `application.properties` 中配置。

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
- Spring Security + JWT 认证
- RBAC 角色权限控制
- 管理员用户管理系统
- 思维导图管理功能
- AI 文案生成集成
- Spring Boot DevTools 开发工具
- Flyway 数据库版本控制
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

### 用户认证

#### 用户注册
- **POST** `/auth/register`
- **请求头**：`Content-Type: application/json`

**请求体**：
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**成功响应** (201)：
```json
{
  "success": true,
  "code": 201,
  "message": "用户注册成功",
  "data": {
    "user_id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "USER",
    "created_at": "2024-12-20T10:00:00Z"
  }
}
```

#### 用户登录
- **POST** `/auth/login`
- **请求头**：`Content-Type: application/json`

**请求体**：
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "user_id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "USER"
    }
  }
}
```

#### Token刷新
- **POST** `/auth/refresh`
- **请求头**：`Content-Type: application/json`

**请求体**：
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 管理员用户管理

#### 获取用户列表 (管理员专用)
- **GET** `/admin/users`
- **请求头**：
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`
- **权限要求**：ADMIN

**查询参数**：
- `page`：页码，默认1
- `limit`：每页数量，默认10，最大100
- `search`：搜索关键词（用户名/邮箱）
- `sortBy`：排序字段（username, email, createdAt, role），默认createdAt
- `sortOrder`：排序方向（asc, desc），默认desc

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "获取用户列表成功",
  "data": {
    "items": [
      {
        "userId": 1,
        "username": "sonic_yann",
        "email": "admin@example.com",
        "role": "ADMIN",
        "createdAt": "2024-12-20T10:00:00Z",
        "updatedAt": "2024-12-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### 更新用户信息 (管理员专用)
- **PUT** `/admin/users/{userId}`
- **请求头**：
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`
- **权限要求**：ADMIN

**请求体**：
```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "role": "USER"
}
```

#### 删除用户 (管理员专用)
- **DELETE** `/admin/users/{userId}`
- **请求头**：`Authorization: Bearer {access_token}`
- **权限要求**：ADMIN

**安全限制**：
- 管理员不能删除自己
- 不能删除最后一个管理员用户

### 思维导图管理

#### 创建思维导图
- **POST** `/mindmaps`
- **请求头**：
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

**请求体**：
```json
{
  "title": "我的思维导图",
  "description": "思维导图描述",
  "nodesData": "[{\"id\":\"root\",\"type\":\"mindMapNode\",\"data\":{\"label\":\"主题\"},\"position\":{\"x\":0,\"y\":0}}]",
  "edgesData": "[]"
}
```

**成功响应** (201)：
```json
{
  "success": true,
  "code": 201,
  "message": "思维导图创建成功",
  "data": {
    "mindMapId": 1,
    "title": "我的思维导图",
    "description": "思维导图描述",
    "nodesData": "[{\"id\":\"root\"...}]",
    "edgesData": "[]",
    "createdAt": "2024-12-20T10:00:00Z",
    "updatedAt": "2024-12-20T10:00:00Z"
  }
}
```

#### 获取思维导图列表
- **GET** `/mindmaps`
- **请求头**：`Authorization: Bearer {access_token}`

**查询参数**：
- `page`：页码，默认1
- `limit`：每页数量，默认10
- `search`：搜索关键词（标题）
- `sortBy`：排序字段（title, createdAt, updatedAt），默认updatedAt
- `sortOrder`：排序方向（asc, desc），默认desc

#### 获取思维导图详情
- **GET** `/mindmaps/{mindMapId}`
- **请求头**：`Authorization: Bearer {access_token}`

#### 更新思维导图
- **PUT** `/mindmaps/{mindMapId}`
- **请求头**：
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

#### 删除思维导图
- **DELETE** `/mindmaps/{mindMapId}`
- **请求头**：`Authorization: Bearer {access_token}`

### 频道管理

#### 创建频道
- **POST** `/channels`
- **请求头**：
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

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
- **请求头**：`Authorization: Bearer {access_token}`

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
- **请求头**：`Authorization: Bearer {access_token}`

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
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

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
- **请求头**：`Authorization: Bearer {access_token}`

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
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

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
  - Authorization: Bearer {access_token}

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
| sort_by | String | 否 | 排序字段，可选值：title、created_at、updated_at、release_date、difficulty，默认created_at |
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
- 401 Unauthorized：未提供认证信息
- 500 Internal Server Error：服务器内部错误

#### 获取脚本详情
- **GET** `/api/v1/scripts/{script_id}`
- **请求头**：`Authorization: Bearer {access_token}`

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
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

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
- **请求头**：`Authorization: Bearer {access_token}`

**路径参数**：
- `script_id`：必填，脚本ID（Long）

**成功响应** (204)：
无响应体

**错误响应**：
- 403：无权限删除该脚本
- 404：脚本不存在

**删除策略**：
- 硬删除，级联删除关联的章节

### 分类管理

#### 创建分类
- **POST** `/api/v1/categories`
- **请求头**：
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

**请求体**：
```json
{
  "category_name": "教程"
}
```

**字段验证**：
- `category_name`：必填，1-100字符，同一用户下唯一

**成功响应** (201)：
```json
{
  "success": true,
  "code": 201,
  "message": "分类创建成功",
  "data": {
    "category_id": 1,
    "category_name": "教程",
    "user_id": 1,
    "created_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 400：参数验证失败
- 409：分类名称已存在

#### 获取分类列表
- **GET** `/api/v1/categories`
- **请求头**：`Authorization: Bearer {access_token}`

**查询参数**：
- `page`：页码，默认1
- `limit`：每页数量，默认10，最大100
- `search`：搜索关键词
- `sort_by`：排序字段（category_name, created_at），默认created_at
- `order`：排序方向（asc, desc），默认desc

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "获取分类列表成功",
  "data": {
    "items": [
      {
        "category_id": 1,
        "category_name": "教程",
        "user_id": 1,
        "created_at": "2025-06-06T10:00:00Z"
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
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

#### 获取分类详情
- **GET** `/api/v1/categories/{category_id}`
- **请求头**：`Authorization: Bearer {access_token}`

**路径参数**：
- `category_id`：必填，分类ID（Long）

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "获取分类详情成功",
  "data": {
    "category_id": 1,
    "category_name": "教程",
    "user_id": 1,
    "created_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 403：无权限访问该分类
- 404：分类不存在

#### 更新分类
- **PUT** `/api/v1/categories/{category_id}`
- **请求头**：
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`

**路径参数**：
- `category_id`：必填，分类ID（Long）

**请求体**：
```json
{
  "category_name": "更新后的分类名称"
}
```

**字段验证**：
- `category_name`：必填，1-100字符，同一用户下唯一

**成功响应** (200)：
```json
{
  "success": true,
  "code": 200,
  "message": "更新成功",
  "data": {
    "category_id": 1,
    "category_name": "更新后的分类名称",
    "user_id": 1,
    "created_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**：
- 400：参数验证失败
- 403：无权限访问该分类
- 404：分类不存在
- 409：分类名称已存在

#### 删除分类
- **DELETE** `/api/v1/categories/{category_id}`
- **请求头**：`Authorization: Bearer {access_token}`

**路径参数**：
- `category_id`：必填，分类ID（Long）

**成功响应** (204)：
无响应体

**错误响应**：
- 403：无权限删除该分类
- 404：分类不存在

**删除策略**：
- 硬删除，如果分类下有脚本，会触发外键约束错误

## 数据库设计

### Users 表
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    api_config TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Channels 表
```sql
CREATE TABLE channels (
    channel_id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_channel_name UNIQUE (user_id, channel_name),
    CONSTRAINT fk_channels_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Categories 表
```sql
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_category_name UNIQUE (user_id, category_name),
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Scripts 表
```sql
CREATE TABLE scripts (
    script_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    alternative_title1 VARCHAR(200),
    alternative_title2 VARCHAR(200),
    description TEXT,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    status VARCHAR(20) DEFAULT 'draft',
    release_date DATE,
    user_id INTEGER NOT NULL,
    channel_id INTEGER,
    category_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_scripts_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_scripts_channel FOREIGN KEY (channel_id) REFERENCES channels(channel_id),
    CONSTRAINT fk_scripts_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

### Chapters 表
```sql
CREATE TABLE chapters (
    chapter_id SERIAL PRIMARY KEY,
    script_id INTEGER NOT NULL,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_script_chapter_number UNIQUE (script_id, chapter_number),
    CONSTRAINT fk_chapters_script FOREIGN KEY (script_id) REFERENCES scripts(script_id) ON DELETE CASCADE
);
```

### Mind_Maps 表
```sql
CREATE TABLE mind_maps (
    mind_map_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    nodes_data TEXT NOT NULL,
    edges_data TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mind_maps_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

## 权限控制

### 角色定义
- **USER**: 普通用户，只能访问自己的数据
- **ADMIN**: 管理员用户，可以管理所有用户和系统设置

### 权限注解
```java
// 只有管理员可以访问
@PreAuthorize("hasRole('ADMIN')")

// 管理员和普通用户都可以访问
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")

// 只能访问自己的数据
@PreAuthorize("hasRole('USER') and #userId == authentication.principal.userId")
```

### API权限矩阵
| 功能模块 | 普通用户 | 管理员 |
|---------|---------|--------|
| 用户认证 | ✅ | ✅ |
| 个人信息管理 | ✅ | ✅ |
| 用户管理 | ❌ | ✅ |
| 脚本管理 | ✅ (自己的) | ✅ (所有) |
| 频道管理 | ✅ (自己的) | ✅ (所有) |
| 分类管理 | ✅ (自己的) | ✅ (所有) |
| 思维导图 | ✅ (自己的) | ✅ (所有) |

## 安全特性

### JWT配置
- **Access Token**: 1小时有效期
- **Refresh Token**: 7天有效期
- **自动刷新**: 前端自动处理Token刷新

### 密码安全
- **加密算法**: BCrypt
- **强度要求**: 最少8位字符
- **存储**: 只存储哈希值，不存储明文

### API安全
- **CORS配置**: 限制跨域访问
- **SQL注入防护**: 参数化查询
- **XSS防护**: 输入验证和输出编码
- **权限验证**: 方法级权限控制

## 开发和部署

### 本地开发
```bash
# 启动数据库
docker run -d --name postgres \
  -e POSTGRES_DB=youtubeplanner \
  -e POSTGRES_USER=youtubeplanner \
  -e POSTGRES_PASSWORD=youtubeplanner123 \
  -p 5432:5432 postgres:15

# 运行应用
mvn spring-boot:run
```

### 生产部署
```bash
# 构建应用
mvn clean package -DskipTests

# 构建Docker镜像
docker build -t youtubeplanner-backend .

# 运行容器
docker run -d -p 8080:8080 youtubeplanner-backend
```

### 环境变量
```properties
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=youtubeplanner
DB_USERNAME=youtubeplanner
DB_PASSWORD=youtubeplanner123

# JWT配置
JWT_SECRET=your-secret-key
JWT_ACCESS_TOKEN_EXPIRATION=3600
JWT_REFRESH_TOKEN_EXPIRATION=604800

# CORS配置
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://youtubeplanner.duckdns.org
```

## 监控和日志

### 健康检查
- **端点**: `/actuator/health`
- **状态**: UP/DOWN
- **检查项**: 数据库连接、磁盘空间

### 应用指标
- **端点**: `/actuator/metrics`
- **指标**: JVM内存、CPU使用率、HTTP请求统计

### 日志配置
- **框架**: Logback
- **级别**: INFO (生产环境)
- **输出**: 控制台 + 文件
- **滚动**: 按日期和大小滚动

## API版本管理

### 版本策略
- **当前版本**: v1
- **URL前缀**: `/api/v1`
- **向后兼容**: 保持现有API稳定

### 版本升级
- 新功能添加到新版本
- 旧版本保持支持
- 废弃通知提前发布

---

这个后端服务提供了完整的YouTube内容创作管理功能，包括AI智能创作、思维导图管理、RBAC权限控制等先进特性，为现代Web应用提供了强大的API支持。 