# 数据库连接测试和故障排除

## 当前问题分析

错误信息：`The connection attempt failed`
这表明网络层面的连接问题，可能的原因：

1. **Supabase数据库不可访问**
2. **网络防火墙阻止连接**
3. **Render平台网络限制**
4. **数据库连接数限制**

## 立即测试步骤

### 1. 验证Supabase数据库状态

请登录您的Supabase Dashboard检查：
- 数据库是否在线
- 是否有连接限制
- 网络访问设置

### 2. 测试数据库连接

可以使用以下工具测试连接：

```bash
# 使用psql测试（如果有的话）
psql "postgresql://postgres:OtvO9P8X36b3up5x@db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres"

# 或使用telnet测试端口
telnet db.nvcagxykymgtmprggwhy.supabase.co 5432
```

### 3. 检查Supabase设置

在Supabase Dashboard中检查：
1. **Settings** → **Database** → **Connection info**
2. 确认连接字符串是否正确
3. 检查是否启用了 **Connection pooling**
4. 查看 **Network restrictions** 设置

## 可能的解决方案

### 方案1: 使用Supabase连接池

Supabase提供连接池功能，可能更适合Render部署：

```
# 连接池URL格式（在Supabase Dashboard中查找）
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### 方案2: 更新数据库凭据

检查Supabase中的实际连接信息，可能需要使用：
- 不同的主机名
- 不同的端口
- 连接池端点

### 方案3: 网络配置

在application-prod.properties中添加网络超时配置：

```properties
# 增加连接超时时间
spring.datasource.hikari.connection-timeout=60000
spring.datasource.hikari.validation-timeout=5000
spring.datasource.hikari.initialization-fail-timeout=1
```

### 方案4: 使用环境变量覆盖

在Render中添加这些环境变量：

```
SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=60000
SPRING_DATASOURCE_HIKARI_VALIDATION_TIMEOUT=5000
SPRING_DATASOURCE_HIKARI_INITIALIZATION_FAIL_TIMEOUT=1
```

## 紧急备用方案

如果Supabase连接仍然有问题，可以考虑：

1. **使用Render的PostgreSQL服务**（付费）
2. **使用其他免费数据库服务**（如ElephantSQL、Neon等）
3. **临时使用H2内存数据库**进行测试

## 下一步行动

1. 首先检查Supabase Dashboard中的连接信息
2. 尝试使用连接池URL
3. 增加连接超时时间
4. 如果仍然失败，考虑备用数据库方案 