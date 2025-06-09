# Youtube Planner Backend

This is the backend service for the Youtube Planner application, built with Spring Boot.

## Prerequisites

- Java 17 or higher
- Maven 3.6.x or higher
- PostgreSQL Database

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd BackendYTP
```

2. Configure the database:
The application uses PostgreSQL database hosted on Supabase. The connection details are already configured in `application.properties`.

3. Build the project:
```bash
mvn clean install
```

4. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Features

- RESTful API endpoints
- PostgreSQL database integration with soft delete support
- JPA/Hibernate for data persistence
- Spring Boot DevTools for development
- Lombok for reducing boilerplate code

## API Documentation

### Base URL
- Base URL: `http://localhost:8080/api/v1`
- API Version: v1
- Authentication: Bearer Token (JWT)
- Data Format: JSON
- Character Encoding: UTF-8

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

### Endpoints

#### Channel Management

##### Create Channel
- **POST** `/channels`
- **Headers Required**: 
  - `X-User-ID`: User ID (Long)
  - `Content-Type`: application/json

**Request Body**:
```json
{
  "channel_name": "我的第一个频道"
}
```

**Field Validation**:
- `channel_name`: Required, 1-100 characters, unique per user

**Success Response** (201):
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

**Error Responses**:
- 400: Parameter validation failed
- 409: Channel name already exists

##### Get Channel List
- **GET** `/channels`
- **Headers Required**: 
  - `X-User-ID`: User ID (Long)

**Query Parameters**:
- `page`: Page number, default 1
- `limit`: Items per page, default 10, max 100
- `search`: Search keyword
- `sort_by`: Sort field (channel_name, created_at), default created_at
- `order`: Sort direction (asc, desc), default desc

**Success Response** (200):
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

##### Get Channel Detail
- **GET** `/channels/{channel_id}`
- **Headers Required**: 
  - `X-User-ID`: User ID (Long)

**Path Parameters**:
- `channel_id`: Required, Channel ID (Long)

**Success Response** (200):
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

**Error Responses**:
- 404: Channel not found

##### Update Channel
- **PUT** `/channels/{channel_id}`
- **Headers Required**: 
  - `X-User-ID`: User ID (Long)
  - `Content-Type`: application/json

**Path Parameters**:
- `channel_id`: Required, Channel ID (Long)

**Request Body**:
```json
{
  "channel_name": "更新后的频道名称"
}
```

**Field Validation**:
- `channel_name`: Required, 1-100 characters, unique per user

**Success Response** (200):
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

**Error Responses**:
- 404: Channel not found
- 409: Channel name already exists

##### Delete Channel
- **DELETE** `/channels/{channel_id}`
- **Headers Required**: 
  - `X-User-ID`: User ID (Long)

**Path Parameters**:
- `channel_id`: Required, Channel ID (Long)

**Success Response** (204):
无响应体

**Error Responses**:
- 404: Channel not found

**删除策略**: 
- 采用软删除，保留数据但标记为已删除
- 关联的脚本不会被删除，但会解除与频道的关联

## Development

The project uses the following technologies:
- Spring Boot 3.2.3
- Spring Data JPA
- PostgreSQL Database
- Project Lombok
- Spring Boot DevTools

## Database Schema

### Channels Table
```sql
CREATE TABLE Channels (
    channel_id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_channel_name UNIQUE (user_id, channel_name)
);
``` 