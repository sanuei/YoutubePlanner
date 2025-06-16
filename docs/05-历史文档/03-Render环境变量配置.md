# Render 环境变量配置指南

## 后端服务环境变量

在Render Dashboard的后端服务中设置以下环境变量：

### 必需的环境变量 - Supabase连接池版本

**重要**: 使用Supabase连接池可以解决网络连接问题

#### 选项1: 分离的用户名密码（推荐）
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
SPRING_DATASOURCE_USERNAME=postgres.nvcagxykymgtmprggwhy
SPRING_DATASOURCE_PASSWORD=OtvO9P8X36b3up5x
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_ACCESS_TOKEN_EXPIRATION=3600
JWT_REFRESH_TOKEN_EXPIRATION=604800
CORS_ALLOWED_ORIGINS=*
```

#### 选项2: 完整URL格式
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres.nvcagxykymgtmprggwhy:OtvO9P8X36b3up5x@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
SPRING_DATASOURCE_USERNAME=postgres.nvcagxykymgtmprggwhy
SPRING_DATASOURCE_PASSWORD=OtvO9P8X36b3up5x
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_ACCESS_TOKEN_EXPIRATION=3600
JWT_REFRESH_TOKEN_EXPIRATION=604800
CORS_ALLOWED_ORIGINS=*
```

### 重要修复说明

**问题**: URL格式错误 - 缺少 `jdbc:` 前缀
**解决**: 确保URL以 `jdbc:postgresql://` 开头

### 常见错误和修复

❌ **错误格式**: `postgresql://...`
✅ **正确格式**: `jdbc:postgresql://...`

❌ **错误格式**: `postgres://...`
✅ **正确格式**: `jdbc:postgresql://...`

## 故障排除 - URL格式修复

### 推荐的URL格式（按优先级）：

```
# 选项1: Supabase连接池（推荐）
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres

# 选项2: 直连数据库
SPRING_DATASOURCE_URL=jdbc:postgresql://db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres

# 选项3: 如果需要SSL，使用这个格式
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?ssl=true

# 选项4: 如果上述都不行，尝试这个
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=prefer
```

### 额外的数据库配置环境变量

针对连接池优化：

```
SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=60000
SPRING_DATASOURCE_HIKARI_VALIDATION_TIMEOUT=5000
SPRING_DATASOURCE_HIKARI_INITIALIZATION_FAIL_TIMEOUT=1
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=3
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=1
```

### 验证步骤

1. 确保URL以 `jdbc:postgresql://` 开头
2. 在Render中重新部署
3. 查看日志是否连接成功
4. 如果失败，依次尝试其他选项

## 前端环境变量

等后端部署成功后，在前端Static Site中设置：

```
REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/api/v1
```

## 部署后配置

1. 获取后端服务的实际URL
2. 更新前端的API_BASE_URL
3. 更新后端的CORS_ALLOWED_ORIGINS为前端的实际URL

## 如果仍然有问题

可能需要在application-prod.properties中添加额外的SSL配置，我们可以通过环境变量来覆盖：

```
SPRING_DATASOURCE_HIKARI_DATA_SOURCE_PROPERTIES_SSL=true
SPRING_DATASOURCE_HIKARI_DATA_SOURCE_PROPERTIES_SSLFACTORY=org.postgresql.ssl.NonValidatingFactory
``` 