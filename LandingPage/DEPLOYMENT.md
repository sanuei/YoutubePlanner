# 🚀 LandingPage 部署指南

## 项目概述
这是一个基于 Next.js 14 的现代化着陆页，使用 TypeScript、Tailwind CSS 和 Framer Motion 构建。

## 部署到 Render

### 方法1：使用 Render Dashboard（推荐）

1. **登录 Render**
   - 访问 [https://render.com](https://render.com)
   - 使用GitHub账号登录

2. **创建新的Web Service**
   - 点击 "New +" 按钮
   - 选择 "Web Service"

3. **连接GitHub仓库**
   - 选择你的 `YoutubePlanner` 仓库
   - 选择 `clean-deploy` 分支

4. **配置服务设置**
   ```
   Name: youtubeplanner-landing
   Environment: Node
   Region: 选择离你最近的区域
   Branch: clean-deploy
   Root Directory: LandingPage
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

5. **设置环境变量**
   在 "Environment Variables" 部分添加：
   ```
   Key: NODE_ENV
   Value: production
   ```

6. **选择计划**
   - 选择 "Free" 计划

7. **部署**
   - 点击 "Create Web Service"

### 方法2：使用 render.yaml

项目已包含 `render.yaml` 配置文件，可以通过以下方式使用：

1. 在 Render Dashboard 中选择 "Blueprint"
2. 连接仓库并指向 `LandingPage/render.yaml`

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **UI组件**: Radix UI
- **图标**: Lucide React

## 构建配置

### package.json 脚本
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Next.js 配置
```javascript
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
}
```

## 部署检查清单

部署前请确认：

- [ ] 所有依赖已正确安装
- [ ] 构建命令无错误
- [ ] 图片域名已在 next.config.js 中配置
- [ ] 环境变量已正确设置
- [ ] 代码已推送到 GitHub

## 性能优化

### 已实现的优化
- 静态生成 (SSG)
- 图片优化
- 代码分割
- CSS 优化

### 建议的额外优化
- 配置 CDN
- 启用 Gzip 压缩
- 设置适当的缓存头

## 监控和维护

### 健康检查
- 路径: `/`
- 预期响应: 200 OK

### 日志监控
- 构建日志可在 Render Dashboard 查看
- 运行时日志通过 `console.log` 输出

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本兼容性
   - 确认所有依赖已正确安装

2. **图片加载失败**
   - 检查 `next.config.js` 中的域名配置
   - 确认图片 URL 可访问

3. **样式问题**
   - 确认 Tailwind CSS 配置正确
   - 检查 PostCSS 配置

## 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Render 部署指南](https://render.com/docs/deploy-nextjs-app)
- [Tailwind CSS 文档](https://tailwindcss.com/docs) 