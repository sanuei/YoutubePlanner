# YouTube规划器 - 用户认证API文档

## 基础信息

- 基础URL：`http://localhost:8080/api/v1`
- API版本：v1
- 认证方式：Bearer Token (JWT)
- 数据格式：JSON
- 字符编码：UTF-8

## 统一响应格式

### 成功响应
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

### 错误响应
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
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

## 认证接口

### 1. 用户注册

**请求信息：**
- 请求方法：POST
- 请求路径：/auth/register
- 请求头：
  - Content-Type: application/json

**请求体：**
```json
{
  "username": "newUser",
  "password": "SecurePassword123!",
  "email": "user@example.com"
}
```

**字段验证：**
- `username`：必填，3-20字符，只能包含字母、数字和下划线
- `password`：必填，8-128字符，必须包含大小写字母、数字和特殊字符
- `email`：必填，有效邮箱格式

**成功响应 (201)：**
```json
{
  "success": true,
  "code": 201,
  "message": "用户注册成功",
  "data": {
    "userId": 1,
    "username": "newUser"
  },
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应：**
- 400：参数验证失败
- 409：用户名或邮箱已存在

### 2. 用户登录

**请求信息：**
- 请求方法：POST
- 请求路径：/auth/login
- 请求头：
  - Content-Type: application/json

**请求体：**
```json
{
  "username": "existingUser",
  "password": "userPassword"
}
```

**成功响应 (200)：**
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "userId": 1,
      "username": "existingUser"
    }
  },
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应：**
- 400：参数验证失败
- 401：用户名或密码错误
- 429：登录尝试次数过多

### 3. 刷新令牌

**请求信息：**
- 请求方法：POST
- 请求路径：/auth/refresh
- 请求头：
  - Content-Type: application/json

**请求体：**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**成功响应 (200)：**
```json
{
  "success": true,
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  },
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

**错误响应：**
- 401：Refresh Token无效或已过期

### 4. 用户登出

**请求信息：**
- 请求方法：POST
- 请求路径：/auth/logout
- 请求头：
  - Content-Type: application/json
  - Authorization: Bearer {access_token}

**请求体：**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**成功响应 (200)：**
```json
{
  "success": true,
  "code": 200,
  "message": "登出成功",
  "data": null,
  "timestamp": "2024-03-19T10:00:00Z",
  "request_id": "uuid-string"
}
```

## 令牌说明

### 访问令牌 (Access Token)
- 类型：JWT
- 有效期：1小时
- 用途：用于访问受保护的API资源
- 获取方式：登录成功后获取
- 使用方式：在请求头中添加 `Authorization: Bearer {access_token}`

### 刷新令牌 (Refresh Token)
- 类型：JWT
- 有效期：7天
- 用途：用于获取新的访问令牌
- 获取方式：登录成功后获取
- 使用方式：在刷新令牌接口中使用

## 安全说明

1. 所有密码在传输和存储时都经过加密处理
2. 使用HTTPS进行安全传输
3. 实现了登录尝试次数限制
4. 令牌使用JWT标准，包含签名验证
5. 支持令牌自动刷新机制

## 错误码说明

- 400：请求参数错误
- 401：未授权或令牌无效
- 403：权限不足
- 404：资源不存在
- 409：资源冲突
- 422：数据验证失败
- 429：请求过于频繁
- 500：服务器内部错误

## 前端集成指南

### 1. 登录流程
1. 调用登录接口获取 access_token 和 refresh_token
2. 将 access_token 存储在内存中（如 Vuex/Pinia store）
3. 将 refresh_token 存储在 localStorage 中
4. 在每次请求时，在请求头中添加 access_token

### 2. Token 刷新流程
1. 当 access_token 过期时（收到 401 响应）
2. 使用 refresh_token 调用刷新接口
3. 获取新的 access_token
4. 更新存储的 access_token
5. 重试之前失败的请求

### 3. 登出流程
1. 调用登出接口
2. 清除内存中的 access_token
3. 清除 localStorage 中的 refresh_token
4. 重定向到登录页面

### 4. 请求拦截器示例（Axios）
```javascript
// 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = store.getters.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/v1/auth/refresh', {
          refreshToken
        });
        const { accessToken } = response.data.data;
        store.commit('setAccessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        store.dispatch('logout');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
```