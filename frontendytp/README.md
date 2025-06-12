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

# YouTube Planner API 文档

## 脚本管理 API

### 获取脚本列表

获取脚本列表，支持分页、搜索、排序和筛选。

**请求**

```http
GET /api/v1/scripts
```

**查询参数**

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 10 |
| search | string | 否 | 搜索关键词，用于搜索脚本标题 |
| sort_by | string | 否 | 排序字段，可选值：created_at, updated_at, title |
| order | string | 否 | 排序方向，可选值：asc, desc |
| channel_id | string | 否 | 频道ID，用于筛选特定频道的脚本 |
| category_id | string | 否 | 分类ID，用于筛选特定分类的脚本 |
| status | string | 否 | 脚本状态，用于筛选特定状态的脚本 |
| difficulty | string | 否 | 难度等级，用于筛选特定难度的脚本 |
| include | string | 否 | 包含关联数据，例如：category |

**响应**

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "items": [
      {
        "script_id": 26,
        "title": "脚本标题",
        "description": "脚本描述",
        "status": "Scripting",
        "difficulty": 3,
        "channel": {
          "channel_id": 19,
          "channel_name": "频道名称"
        },
        "category": {
          "category_id": 2,
          "category_name": "分类名称"
        },
        "release_date": "2024-06-12",
        "chapters_count": 1,
        "created_at": "2024-06-12T12:49:35.453023Z",
        "updated_at": "2024-06-12T12:49:35.453055Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 18,
      "pages": 2,
      "has_next": true,
      "has_prev": false
    }
  },
  "timestamp": "2024-06-12T13:29:36.062627Z",
  "request_id": "a3a24126-132c-45f1-bf1b-e31e29536f5f"
}
```

**响应字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| success | boolean | 请求是否成功 |
| code | number | HTTP 状态码 |
| message | string | 响应消息 |
| data.items | array | 脚本列表 |
| data.pagination | object | 分页信息 |
| timestamp | string | 响应时间戳 |
| request_id | string | 请求ID |

**脚本对象字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| script_id | number | 脚本ID |
| title | string | 脚本标题 |
| description | string | 脚本描述 |
| status | string | 脚本状态 |
| difficulty | number | 难度等级 |
| channel | object | 关联的频道信息 |
| category | object | 关联的分类信息 |
| release_date | string | 发布日期 |
| chapters_count | number | 章节数量 |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

**分页信息字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| page | number | 当前页码 |
| limit | number | 每页数量 |
| total | number | 总记录数 |
| pages | number | 总页数 |
| has_next | boolean | 是否有下一页 |
| has_prev | boolean | 是否有上一页 |

**示例请求**

```bash
# 获取第一页脚本列表
curl -X GET "http://localhost:8080/api/v1/scripts?page=1&limit=10"

# 搜索特定标题的脚本
curl -X GET "http://localhost:8080/api/v1/scripts?search=Python"

# 按创建时间降序排序
curl -X GET "http://localhost:8080/api/v1/scripts?sort_by=created_at&order=desc"

# 筛选特定分类的脚本
curl -X GET "http://localhost:8080/api/v1/scripts?category_id=2"

# 包含分类信息
curl -X GET "http://localhost:8080/api/v1/scripts?include=category"
```
