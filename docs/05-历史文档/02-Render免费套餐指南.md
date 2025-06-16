# Render免费套餐部署指南

## 🆓 免费套餐限制说明

Render免费套餐有以下限制：
- ❌ 不支持持久化磁盘存储
- ❌ 不支持服务间自动URL引用
- ❌ Web Service每月750小时限制
- ✅ Static Site无限制且免费
- ✅ 支持自动SSL证书
- ✅ 支持自动部署

## 📋 推荐部署方案

**后端：** Web Service (Docker)
**前端：** Static Site (更经济)

## 🚀 部署步骤

**重要提示：** Render的Blueprint功能不支持`static`类型服务，需要分别部署前后端。

### 步骤1：准备代码

确保你的代码已经推送到GitHub仓库，包含所有必要的文件。

### 步骤1.5：选择部署方式

**方式A：使用Blueprint + 手动创建（推荐）**
- 使用 `render-backend-only.yaml` 创建后端服务
- 手动创建前端Static Site

**方式B：完全手动创建**
- 手动创建后端Web Service
- 手动创建前端Static Site

### 步骤2：部署后端服务

**方式A：使用Blueprint（推荐）**

1. 登录 [Render](https://render.com)
2. 点击 **"New +"** → **"Blueprint"**
3. 选择你的GitHub仓库
4. 选择 `render-backend-only.yaml` 文件
5. 点击 **"Apply"**

**方式B：手动创建Web Service**

1. 登录 [Render](https://render.com)
2. 点击 **"New +"** → **"Web Service"**
3. 选择你的GitHub仓库
4. 配置如下：
   - **Name:** `youtubeplanner-backend`
   - **Runtime:** `Docker`  
   - **Dockerfile Path:** `./BackendYTP/Dockerfile`
   - **Instance Type:** `Free`

5. 添加环境变量：
   ```
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:postgresql://db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=OtvO9P8X36b3up5x
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   JWT_ACCESS_TOKEN_EXPIRATION=3600
   JWT_REFRESH_TOKEN_EXPIRATION=604800
   CORS_ALLOWED_ORIGINS=*
   ```

6. 点击 **"Create Web Service"**

7. 等待部署完成，记录后端URL（例如：`https://youtubeplanner-backend-xxx.onrender.com`）

### 步骤3：部署前端服务

1. 在Render Dashboard中，点击 **"New +"** → **"Static Site"**
2. 选择同一个GitHub仓库
3. 配置如下：
   - **Name:** `youtubeplanner-frontend`
   - **Build Command:** `cd frontendytp && npm ci && npm run build`
   - **Publish Directory:** `frontendytp/build`

4. 添加环境变量：
   ```
   REACT_APP_API_BASE_URL=https://你的后端URL/api/v1
   ```
   将 `你的后端URL` 替换为步骤2中记录的后端URL

5. 点击 **"Create Static Site"**

### 步骤4：更新CORS配置

1. 等待前端部署完成，记录前端URL
2. 回到后端服务设置
3. 更新 `CORS_ALLOWED_ORIGINS` 环境变量：
   ```
   CORS_ALLOWED_ORIGINS=https://你的前端URL
   ```

4. 保存并重新部署后端服务

## ✅ 验证部署

### 后端验证
- 访问健康检查：`https://你的后端URL/actuator/health`
- 应该返回：`{"status":"UP"}`

### 前端验证
- 访问前端URL
- 检查页面是否正常加载
- 测试API调用是否正常

### 集成测试
- 尝试登录功能
- 测试数据操作
- 检查浏览器控制台是否有错误

## 🛠️ 常见问题解决

### 问题1：部署失败 - "unknown type 'static'"
**解决方案：** 使用 `render-backend-only.yaml` 创建后端，手动创建前端Static Site

### 问题2：部署失败 - "disks are not supported"
**解决方案：** 免费套餐不支持持久化磁盘，已在配置中移除

  ### 问题3：API调用失败 - CORS错误
**解决方案：** 
1. 确认 `CORS_ALLOWED_ORIGINS` 设置正确
2. 检查前端 `REACT_APP_API_BASE_URL` 配置

### 问题4：前端路由404错误
**解决方案：** 确认使用Static Site部署，不是Web Service

### 问题5：环境变量不生效
**解决方案：** 
1. 检查变量名是否正确
2. 重新部署服务
3. 检查构建日志

## 💡 优化建议

### 减少构建时间
- 使用 `.dockerignore` 排除不必要文件
- 优化Dockerfile的层缓存

### 减少冷启动时间
- 后端服务会在15分钟无活动后休眠
- 考虑使用免费的监控服务保持活跃

### 监控和日志
- 使用Render的内置日志查看功能
- 设置合理的日志级别（INFO而不是DEBUG）

## 📊 成本分析

**完全免费方案：**
- 后端Web Service: 750小时/月（约31天）
- 前端Static Site: 无限制
- 总成本: $0/月

**注意：** 如果后端使用超过750小时，需要升级到付费套餐

## 🔄 自动部署

配置自动部署：
1. 在服务设置中启用 "Auto-Deploy"
2. 每次推送到主分支时自动部署
3. 可以在特定分支推送时触发部署

---

**创建时间：** 2024年12月
**适用版本：** Render免费套餐
**状态：** ✅ 已验证 