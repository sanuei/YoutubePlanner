# YouTube Planner

一个用于管理 YouTube 频道和视频内容的现代化管理系统。

## 功能特性

- 用户认证系统
- 频道管理
- 分类管理
- 影片脚本管理
- 响应式设计
- Material Design UI

## 技术栈

- React
- TypeScript
- Material-UI (MUI)
- React Router
- Framer Motion
- Notistack

## 开发说明

### 认证系统

目前处于开发阶段，认证系统暂时被禁用。相关代码位于：
- `src/components/ProtectedRoute.tsx`
- `src/contexts/AuthContext.tsx`
- `src/components/Login.tsx`

在生产环境部署前需要：
1. 启用 ProtectedRoute 中的认证检查（取消注释相关代码）
2. 实现 AuthContext 中的实际登录 API 调用
3. 配置正确的 API 端点

### 开发模式下的路由

当前所有路由都可以直接访问：
- `/users` - 用户管理
- `/channels` - 频道管理
- `/categories` - 分类管理
- `/scripts` - 影片脚本管理
- `/login` - 登录页面

### 待完成功能

- [ ] 实现实际的登录 API 集成
- [ ] 完善用户管理界面
- [ ] 完善分类管理界面
- [ ] 完善影片脚本管理界面
- [ ] 添加更多的数据验证
- [ ] 添加错误处理机制
- [ ] 添加用户权限管理

## 项目设置

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

## 注意事项

1. 开发阶段认证系统已禁用，部署前需要重新启用
2. 登录/登出功能已实现但未连接到后端
3. 部分管理页面仍在开发中

## 样式主题

项目使用了现代化的设计风格：
- 玻璃拟态（Glassmorphism）设计
- 渐变色彩
- 响应式布局
- 动画过渡效果
- 统一的间距和排版

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

[MIT](https://opensource.org/licenses/MIT)
