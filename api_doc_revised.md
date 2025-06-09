# 影片脚本管理系统 API 接口文档 v1.1

## 1. 引言

本文档定义了影片脚本管理系统的RESTful API接口规范。系统采用JWT认证，支持用户管理、频道管理、分类管理和影片脚本管理等核心功能。

- **基础URL**: `https://api.example.com/v1`
- **API版本**: v1
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 2. 通用规范

### 2.1 请求头规范
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  # 需要认证的接口
Accept: application/json
```

### 2.2 统一响应格式
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

### 2.3 错误响应格式
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

### 2.4 分页响应格式
```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "has_next": true,
      "has_prev": false
    }
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

## 3. 用户认证接口

### 3.1 用户注册
**POST** `/auth/register`

**请求体**:
```json
{
  "username": "newUser",
  "password": "SecurePassword123!",
  "email": "user@example.com"
}
```

**字段验证**:
- `username`: 必填，3-20字符，字母数字下划线
- `password`: 必填，8-128字符，至少包含大小写字母、数字、特殊字符
- `email`: 必填，有效邮箱格式

**成功响应** (201):
```json
{
  "success": true,
  "code": 201,
  "message": "用户注册成功",
  "data": {
    "user": {
      "user_id": 1,
      "username": "newUser",
      "email": "user@example.com",
      "created_at": "2025-06-06T10:00:00Z"
    }
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**:
- 400: 参数验证失败
- 409: 用户名或邮箱已存在
- 422: 数据验证失败

### 3.2 用户登录
**POST** `/auth/login`

**请求体**:
```json
{
  "username": "existingUser",
  "password": "userPassword"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "user_id": 1,
      "username": "existingUser"
    }
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**:
- 400: 参数验证失败
- 401: 用户名或密码错误
- 429: 登录尝试次数过多

### 3.3 刷新令牌
**POST** `/auth/refresh`

**请求体**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 3600
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**:
- 401: Refresh Token无效或已过期

### 3.4 用户登出
**POST** `/auth/logout` 🔒

**请求体**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "登出成功",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

## 4. 用户管理接口

### 4.1 获取当前用户信息
**GET** `/users/me` 🔒

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "user_id": 1,
    "username": "currentUser",
    "email": "current@example.com",
    "created_at": "2025-06-06T10:00:00Z",
    "updated_at": "2025-06-06T10:00:00Z",
    "stats": {
      "total_scripts": 15,
      "total_channels": 3,
      "total_categories": 5
    }
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 4.2 更新用户信息
**PUT** `/users/me` 🔒

**请求体**:
```json
{
  "email": "new@example.com"
}
```

**字段验证**:
- `email`: 可选，有效邮箱格式

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "用户信息更新成功",
  "data": {
    "user_id": 1,
    "username": "currentUser",
    "email": "new@example.com",
    "updated_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 4.3 修改密码
**PUT** `/users/me/password` 🔒

**请求体**:
```json
{
  "current_password": "oldPassword",
  "new_password": "NewSecurePassword123!"
}
```

**字段验证**:
- `current_password`: 必填
- `new_password`: 必填，8-128字符，至少包含大小写字母、数字、特殊字符

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "密码修改成功",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**:
- 400: 参数验证失败
- 401: 当前密码错误
- 422: 新密码强度不够

## 5. 频道管理接口

### 5.1 创建频道
**POST** `/channels` 🔒

**请求体**:
```json
{
  "channel_name": "我的第一个频道"
}
```

**字段验证**:
- `channel_name`: 必填，1-100字符，同一用户下唯一

**成功响应** (201):
```json
{
  "success": true,
  "code": 201,
  "message": "频道创建成功",
  "data": {
    "channel_id": 1,
    "channel_name": "我的第一个频道",
    "user_id": 1,
    "created_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**:
- 400: 参数验证失败
- 409: 频道名称已存在

### 5.2 获取频道列表
**GET** `/channels` 🔒

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认10，最大100
- `search`: 搜索关键词
- `sort_by`: 排序字段 (channel_name, created_at)，默认created_at
- `order`: 排序方向 (asc, desc)，默认desc

**成功响应** (200):
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

### 5.3 获取频道详情
**GET** `/channels/{channel_id}` 🔒

**路径参数**:
- `channel_id`: 必填，整数，频道ID

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取频道详情成功",
  "data": {
    "channel_id": 1,
    "channel_name": "我的第一个频道",
    "user_id": 1,
    "created_at": "2025-06-06T10:00:00Z",
    "scripts_count": 5
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应**:
- 404: 频道不存在
- 403: 无权限访问该频道

### 5.4 更新频道
**PUT** `/channels/{channel_id}` 🔒

**路径参数**:
- `channel_id`: 必填，整数，频道ID

**请求体**:
```json
{
  "channel_name": "更新后的频道名称"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "频道更新成功",
  "data": {
    "channel_id": 1,
    "channel_name": "更新后的频道名称",
    "user_id": 1,
    "created_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 5.5 删除频道
**DELETE** `/channels/{channel_id}` 🔒

**路径参数**:
- `channel_id`: 必填，整数，频道ID

**成功响应** (204):
无响应体

**错误响应**:
- 404: 频道不存在
- 403: 无权限删除该频道

**删除策略**: 软删除，关联脚本的channel_id设为null

## 6. 分类管理接口

### 6.1 创建分类
**POST** `/categories` 🔒

**请求体**:
```json
{
  "category_name": "教程"
}
```

**字段验证**:
- `category_name`: 必填，1-100字符，同一用户下唯一

**成功响应** (201):
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

### 6.2 获取分类列表
**GET** `/categories` 🔒

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认10，最大100
- `search`: 搜索关键词
- `sort_by`: 排序字段 (category_name, created_at)，默认created_at
- `order`: 排序方向 (asc, desc)，默认desc

### 6.3 获取分类详情
**GET** `/categories/{category_id}` 🔒

**路径参数**:
- `category_id`: 必填，整数，分类ID

### 6.4 更新分类
**PUT** `/categories/{category_id}` 🔒

**路径参数**:
- `category_id`: 必填，整数，分类ID

### 6.5 删除分类
**DELETE** `/categories/{category_id}` 🔒

**路径参数**:
- `category_id`: 必填，整数，分类ID

## 7. 影片脚本管理接口

### 7.1 创建脚本
**POST** `/scripts` 🔒

**请求体**:
```json
{
  "title": "我的第一个影片脚本",
  "alternative_title1": "备选标题",
  "description": "脚本描述",
  "content_chapter1": "第一章内容",
  "content_chapter2": "第二章内容",
  "content_chapter3": "第三章内容",
  "conclusion": "总结",
  "difficulty": 3,
  "status": "Scripting",
  "release_date": "2025-12-31",
  "channel_id": 1,
  "category_id": 2
}
```

**字段验证**:
- `title`: 必填，1-255字符
- `alternative_title1`: 可选，最大255字符
- `description`: 可选，文本
- `content_chapter1`: 可选，文本
- `content_chapter2`: 可选，文本
- `content_chapter3`: 可选，文本
- `conclusion`: 可选，文本
- `difficulty`: 可选，整数1-5
- `status`: 可选，字符串，最大50字符
- `release_date`: 可选，日期格式YYYY-MM-DD
- `channel_id`: 可选，整数，必须是用户拥有的频道
- `category_id`: 可选，整数，必须是用户拥有的分类

**成功响应** (201):
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
    "content_chapter1": "第一章内容",
    "content_chapter2": "第二章内容",
    "content_chapter3": "第三章内容",
    "conclusion": "总结",
    "difficulty": 3,
    "status": "Scripting",
    "release_date": "2025-12-31",
    "user_id": 1,
    "channel_id": 1,
    "category_id": 2,
    "created_at": "2025-06-06T10:00:00Z",
    "updated_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 7.2 获取脚本列表
**GET** `/scripts` 🔒

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认10，最大100
- `channel_id`: 按频道筛选
- `category_id`: 按分类筛选
- `status`: 按状态筛选
- `difficulty`: 按难度筛选
- `search`: 搜索关键词（搜索标题和描述）
- `date_from`: 开始日期，格式YYYY-MM-DD
- `date_to`: 结束日期，格式YYYY-MM-DD
- `sort_by`: 排序字段 (title, created_at, updated_at, release_date)，默认created_at
- `order`: 排序方向 (asc, desc)，默认desc

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取脚本列表成功",
  "data": {
    "items": [
      {
        "script_id": 1,
        "title": "我的第一个影片脚本",
        "description": "脚本描述",
        "status": "Scripting",
        "difficulty": 3,
        "release_date": "2025-12-31",
        "channel": {
          "channel_id": 1,
          "channel_name": "我的第一个频道"
        },
        "category": {
          "category_id": 2,
          "category_name": "教程"
        },
        "created_at": "2025-06-06T10:00:00Z",
        "updated_at": "2025-06-06T10:00:00Z"
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

### 7.3 获取脚本详情
**GET** `/scripts/{script_id}` 🔒

**路径参数**:
- `script_id`: 必填，整数，脚本ID

**成功响应** (200):
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
    "content_chapter1": "第一章内容",
    "content_chapter2": "第二章内容",
    "content_chapter3": "第三章内容",
    "conclusion": "总结",
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
    "created_at": "2025-06-06T10:00:00Z",
    "updated_at": "2025-06-06T10:00:00Z"
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 7.4 更新脚本
**PUT** `/scripts/{script_id}` 🔒

**路径参数**:
- `script_id`: 必填，整数，脚本ID

**请求体**:
```json
{
  "title": "更新后的标题",
  "status": "Review"
}
```

**支持部分更新，字段验证同创建接口**

### 7.5 删除脚本
**DELETE** `/scripts/{script_id}` 🔒

**路径参数**:
- `script_id`: 必填，整数，脚本ID

**成功响应** (204):
无响应体

**删除策略**: 硬删除

### 7.6 脚本统计
**GET** `/scripts/stats` 🔒

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取统计信息成功",
  "data": {
    "total_scripts": 150,
    "status_distribution": {
      "Scripting": 45,
      "Review": 20,
      "Published": 50,
      "Archived": 5
    },
    "difficulty_distribution": {
      "1": 10,
      "2": 30,
      "3": 60,
      "4": 40,
      "5": 10
    },
    "monthly_created": {
      "2025-04": 15,
      "2025-05": 20,
      "2025-06": 18
    }
  },
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

## 8. 状态码说明

| 状态码 | 说明 | 场景 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或认证失败 |
| 403 | Forbidden | 已认证但无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 数据验证失败 |
| 429 | Too Many Requests | 请求频率限制 |
| 500 | Internal Server Error | 服务器内部错误 |

## 9. 安全和性能

### 9.1 认证和授权
- JWT Token有效期: 1小时
- Refresh Token有效期: 30天
- 支持Token黑名单机制
- 实现基于用户的访问控制

### 9.2 请求限制
- 每个用户每分钟最多100个请求
- 每个IP每分钟最多1000个请求

### 9.3 数据验证
- 所有输入数据进行严格验证和过滤
- 防止SQL注入、XSS攻击
- 敏感数据加密存储

### 9.4 缓存策略
- 用户信息缓存15分钟
- 频道和分类列表缓存5分钟
- 支持ETags和条件请求

## 10. 版本控制

API采用URL路径版本控制：
- 当前版本: `/v1`
- 向后兼容至少支持两个版本
- 废弃API提前3个月通知

## 11. 错误码定义

| 错误码 | 说明 |
|--------|------|
| 1001 | 用户名已存在 |
| 1002 | 邮箱已存在 |
| 1003 | 密码强度不够 |
| 1004 | 当前密码错误 |
| 2001 | 频道名称已存在 |
| 2002 | 频道不存在 |
| 2003 | 无权限访问该频道 |
| 3001 | 分类名称已存在 |
| 3002 | 分类不存在 |
| 3003 | 无权限访问该分类 |
| 4001 | 脚本不存在 |
| 4002 | 无权限访问该脚本 |
| 5001 | Token无效或已过期 |
| 5002 | 权限不足 |

---

🔒 表示需要认证的接口

*本文档版本: v1.1*  
*最后更新: 2025-06-06*