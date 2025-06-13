# 用户管理接口文档

## 1. 获取当前用户信息

### 接口说明
获取当前登录用户的详细信息，包括用户基本信息、统计数据和创建时间等。

### 请求信息
- 请求方法：GET
- 请求路径：`/api/v1/users/me`
- 需要认证：是
- 请求头：
  ```
  Authorization: Bearer {access_token}
  ```

### 响应信息
#### 成功响应 (200)
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
    "avatar_url": "https://example.com/avatar.jpg",
    "display_name": "Current User",
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

#### 错误响应
##### 未认证 (401)
```json
{
  "success": false,
  "code": 401,
  "message": "未认证",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

##### 服务器错误 (500)
```json
{
  "success": false,
  "code": 500,
  "message": "服务器内部错误",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 字段说明
| 字段名 | 类型 | 说明 |
|--------|------|------|
| user_id | Long | 用户ID |
| username | String | 用户名 |
| email | String | 邮箱地址 |
| created_at | String | 创建时间 |
| updated_at | String | 更新时间 |
| avatar_url | String | 头像URL |
| display_name | String | 显示名称 |
| stats.total_scripts | Integer | 脚本总数 |
| stats.total_channels | Integer | 频道总数 |
| stats.total_categories | Integer | 分类总数 |

### 注意事项
1. 该接口需要用户登录后才能访问
2. 返回的统计数据是实时计算的
3. 时间格式为ISO 8601标准格式 

## 2. 更新用户信息

### 接口说明
更新当前登录用户的基本信息。

### 请求信息
- 请求方法：PUT
- 请求路径：`/api/v1/users/me`
- 需要认证：是
- 请求头：
  ```
  Authorization: Bearer {access_token}
  Content-Type: application/json
  ```
- 请求体：
  ```json
  {
    "email": "new@example.com"
  }
  ```

### 响应信息
#### 成功响应 (200)
```json
{
  "success": true,
  "code": 200,
  "message": "用户信息更新成功",
  "data": {
    "user_id": 1,
    "username": "currentUser",
    "email": "new@example.com",
    "created_at": "2025-06-06T10:00:00Z",
    "updated_at": "2025-06-06T10:00:00Z",
    "avatar_url": "https://example.com/avatar.jpg",
    "display_name": "Current User",
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

## 3. 修改密码

### 接口说明
修改当前登录用户的密码。

### 请求信息
- 请求方法：PUT
- 请求路径：`/api/v1/users/me/password`
- 需要认证：是
- 请求头：
  ```
  Authorization: Bearer {access_token}
  Content-Type: application/json
  ```
- 请求体：
  ```json
  {
    "current_password": "oldPassword",
    "new_password": "NewSecurePassword123!"
  }
  ```

### 响应信息
#### 成功响应 (200)
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

### 错误响应
#### 当前密码错误 (400)
```json
{
  "success": false,
  "code": 400,
  "message": "当前密码错误",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

#### 邮箱已被使用 (400)
```json
{
  "success": false,
  "code": 400,
  "message": "邮箱已被使用",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

#### 未认证 (401)
```json
{
  "success": false,
  "code": 401,
  "message": "未认证",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

#### 服务器错误 (500)
```json
{
  "success": false,
  "code": 500,
  "message": "服务器内部错误",
  "data": null,
  "timestamp": "2025-06-06T10:00:00Z",
  "request_id": "uuid-string"
}
```

### 字段说明
| 字段名 | 类型 | 说明 |
|--------|------|------|
| user_id | Long | 用户ID |
| username | String | 用户名 |
| email | String | 邮箱地址 |
| created_at | String | 创建时间 |
| updated_at | String | 更新时间 |
| avatar_url | String | 头像URL |
| display_name | String | 显示名称 |
| stats.total_scripts | Integer | 脚本总数 |
| stats.total_channels | Integer | 频道总数 |
| stats.total_categories | Integer | 分类总数 |

### 注意事项
1. 所有接口都需要用户登录后才能访问
2. 返回的统计数据是实时计算的
3. 时间格式为ISO 8601标准格式
4. 密码修改需要验证当前密码
5. 邮箱更新时会检查是否已被其他用户使用 