# YouTube Planner

## 项目简介

YouTube Planner 是一个现代化的 YouTube 内容管理系统，旨在帮助创作者高效管理频道内容和视频脚本。系统采用现代化的技术栈和设计理念，提供直观的用户界面和强大的功能支持。

## 核心功能

### 0. 首页展示
- 产品介绍和功能展示
- 用户评价和社会证明
- 数据统计展示
- CTA 引导注册/登录
- 响应式设计，支持移动端
- 智能导航：根据登录状态显示不同按钮
- 联系方式：GitHub、YouTube、Instagram 链接

### 1. 用户系统
- 用户认证与授权
- 个人信息管理
- 密码修改
- 头像设置

### 2. 频道管理
- 频道创建与编辑
- 频道信息展示
- 频道关联脚本统计
- 频道分类管理

### 3. 分类管理
- 分类创建与编辑
- 分类关联脚本统计
- 分类筛选功能

### 4. 脚本管理
- 脚本创建与编辑
  - 多章节管理
  - 难度等级设置
  - 状态标记
  - 发布日期设置
- 高级筛选功能
  - 关键词搜索
  - 频道筛选
  - 分类筛选
  - 状态筛选
  - 难度筛选
  - 日期范围筛选
- 排序功能
  - 创建时间排序
  - 更新时间排序
  - 发布日期排序
  - 标题排序
- 分页功能
  - 页码导航
  - 每页显示数量控制

## 技术架构

### 前端技术栈
- React 18
- TypeScript 4.x
- Material-UI (MUI) 5.x
- React Router 6.x
- Framer Motion
- Notistack
- Axios
- Date-fns

### 项目结构
```
src/
├── components/     # 组件目录
│   ├── HomePage.tsx           # 首页组件
│   ├── PlaceholderImage.tsx   # 占位图片组件
│   ├── Login.tsx              # 登录页面
│   ├── Register.tsx           # 注册页面
│   ├── Layout.tsx             # 主布局组件
│   ├── ProtectedRoute.tsx     # 路由保护组件
│   ├── UserManagement.tsx     # 用户管理
│   ├── ChannelList.tsx        # 频道列表
│   ├── CategoryManagement.tsx # 分类管理
│   ├── ScriptManagement.tsx   # 脚本管理
│   ├── ScriptCreate.tsx       # 脚本创建
│   ├── ScriptEdit.tsx         # 脚本编辑
│   └── ScriptPreview.tsx      # 脚本预览
├── contexts/       # 上下文管理
├── services/       # API 服务
├── theme/          # 主题配置
└── utils/          # 工具函数
```

### 路由结构
```
/                    # 首页（产品介绍，无需登录）
/login              # 登录页面
/register           # 注册页面
/dashboard          # 重定向到 /channels
/users              # 用户管理（需要登录）
/channels           # 频道管理（需要登录）
/categories         # 分类管理（需要登录）
/scripts            # 脚本管理（需要登录）
/scripts/create     # 创建脚本（需要登录）
/scripts/:id/edit   # 编辑脚本（需要登录）
/scripts/:id/preview # 预览脚本（需要登录）
```

### 联系方式
- **GitHub**: [https://github.com/sanuei/YoutubePlanner](https://github.com/sanuei/YoutubePlanner)
- **YouTube**: [https://www.youtube.com/@sonicyann](https://www.youtube.com/@sonicyann)
- **Instagram**: [https://www.instagram.com/sonic_yann/](https://www.instagram.com/sonic_yann/)

## 开发指南

### 环境要求
- Node.js >= 16.x
- npm >= 8.x

### 安装步骤
1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm start
```

4. 构建生产版本
```bash
npm run build
```

### 开发注意事项
1. 认证系统
   - 开发阶段认证系统已禁用
   - 部署前需启用 `ProtectedRoute` 中的认证检查
   - 实现 `AuthContext` 中的实际登录 API 调用
   - 配置正确的 API 端点

2. API 接口
   - 基础路径配置在 `src/services/api.ts`
   - 所有请求通过 Axios 实例处理
   - 支持请求拦截和响应拦截
   - 统一的错误处理机制

3. 路由配置
   - 所有路由在 `App.tsx` 中统一管理
   - 受保护路由使用 `ProtectedRoute` 组件包装
   - 支持路由懒加载

## 部署说明

### 生产环境配置
1. 启用认证系统
2. 配置正确的 API 端点
3. 设置环境变量
4. 构建生产版本
5. 部署到服务器

### 安全注意事项
1. 确保 API 密钥安全存储
2. 启用 HTTPS
3. 配置 CORS 策略
4. 实现请求频率限制

## 贡献指南

### 开发流程
1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 代码规范
1. 使用 TypeScript 类型注解
2. 遵循 ESLint 规则
3. 编写单元测试
4. 保持代码注释完整

## 许可证

[MIT](https://opensource.org/licenses/MIT)

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至：[邮箱地址]
- 项目主页：[项目地址]

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
