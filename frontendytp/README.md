# YouTube Planner

一个用于管理 YouTube 频道和视频内容的现代化管理系统。

## 功能特性

- 用户认证系统
- 频道管理
- 分类管理
- 影片脚本管理
  - 创建和编辑脚本
  - 多章节管理
  - 难度和状态标记
  - 发布日期设置
  - 关联频道和分类
  - 高级筛选和搜索
  - 分页和排序
- 响应式设计
- Material Design UI

## 技术栈

- React
- TypeScript
- Material-UI (MUI)
- React Router
- Framer Motion
- Notistack
- Axios
- Date-fns

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
- `/scripts/create` - 创建新脚本
- `/login` - 登录页面

### 脚本管理功能

脚本管理模块提供以下功能：

1. 创建新脚本
   - 设置标题和备选标题
   - 添加描述
   - 添加多个章节
   - 每个章节包含标题和内容

2. 编辑现有脚本
   - 修改脚本基本信息
   - 设置难度等级（1-5）
   - 设置状态（编写中/审核中/已完成）
   - 设置发布日期
   - 关联频道和分类

3. 删除脚本
   - 删除确认机制
   - 级联删除相关章节

4. 列表展示
   - 网格布局展示
   - 显示关键信息
   - 快速操作按钮

5. 高级筛选功能
   - 关键词搜索（标题和描述）
   - 频道筛选
   - 分类筛选
   - 状态筛选
   - 难度筛选
   - 日期范围筛选

6. 排序功能
   - 创建时间排序
   - 更新时间排序
   - 发布日期排序
   - 标题排序
   - 升序/降序切换

7. 分页功能
   - 页码导航
   - 每页显示数量控制

### API 接口

#### 脚本管理接口

1. 获取脚本列表
   - 路径：GET /api/v1/scripts
   - 支持分页、筛选和排序
   - 请求参数：
     - page：页码
     - limit：每页数量
     - channel_id：频道ID
     - category_id：分类ID
     - status：状态
     - difficulty：难度
     - search：搜索关键词
     - date_from：开始日期
     - date_to：结束日期
     - sort_by：排序字段
     - order：排序方向

2. 创建脚本
   - 路径：POST /api/v1/scripts
   - 请求体包含标题、描述、章节等信息

3. 更新脚本
   - 路径：PUT /api/v1/scripts/:id
   - 支持更新所有脚本属性

4. 删除脚本
   - 路径：DELETE /api/v1/scripts/:id
   - 级联删除相关章节

### 待完成功能

- [ ] 实现实际的登录 API 集成
- [ ] 完善用户管理界面
- [ ] 完善分类管理界面
- [ ] 添加更多的数据验证
- [ ] 添加错误处理机制
- [ ] 添加用户权限管理
- [ ] 添加脚本导入/导出功能
- [ ] 添加脚本版本控制
- [ ] 添加脚本模板功能
- [ ] 添加脚本协作功能

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
4. 脚本管理模块需要后端 API 支持
5. API 基础路径配置在 `src/services/api.ts` 中

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
