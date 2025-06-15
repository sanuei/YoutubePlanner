# Render 环境变量配置指南

## 后端服务环境变量

在Render Dashboard的后端服务中设置以下环境变量：

### 必需的环境变量

```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=OtvO9P8X36b3up5x
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_ACCESS_TOKEN_EXPIRATION=3600
JWT_REFRESH_TOKEN_EXPIRATION=604800
CORS_ALLOWED_ORIGINS=*
```

### 重要注意事项

1. **数据库URL**: 添加了 `?sslmode=require` 参数，这对于Supabase连接很重要
2. **SSL连接**: Supabase要求SSL连接
3. **网络访问**: 确保Render可以访问外部数据库

## 故障排除

### 如果仍然连接失败，尝试以下URL格式：

```
# 选项1: 带SSL参数
SPRING_DATASOURCE_URL=jdbc:postgresql://db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres?sslmode=require&user=postgres&password=OtvO9P8X36b3up5x

# 选项2: 带更多SSL参数
SPRING_DATASOURCE_URL=jdbc:postgresql://db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres?sslmode=require&sslcert=&sslkey=&sslrootcert=

# 选项3: 使用连接池参数
SPRING_DATASOURCE_URL=jdbc:postgresql://db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres?sslmode=require&prepareThreshold=0&preparedStatementCacheQueries=0
```

### 验证步骤

1. 在Render日志中查看具体的连接错误信息
2. 确认Supabase数据库是否在线
3. 检查Supabase的连接限制和防火墙设置
4. 验证数据库凭据是否正确

## 前端环境变量

等后端部署成功后，在前端Static Site中设置：

```
REACT_APP_API_BASE_URL=https://your-backend-service-name.onrender.com/api/v1
```

## 部署后配置

1. 获取后端服务的实际URL
2. 更新前端的API_BASE_URL
3. 更新后端的CORS_ALLOWED_ORIGINS为前端的实际URL 