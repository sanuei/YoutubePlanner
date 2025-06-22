# YouTube Planner - 智能视频内容创作管理平台

<div align="center">

![YouTube Planner Logo](public/typlogo.png)

**专为YouTube创作者打造的一站式智能内容管理平台**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-blue.svg)](https://mui.com/)
[![React Flow](https://img.shields.io/badge/React--Flow-11.x-green.svg)](https://reactflow.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[在线演示](https://youtubeplanner.duckdns.org/) · [快速开始](#快速开始) · [功能特性](#功能特性) · [API文档](#api文档)

</div>

## 🎯 项目简介

YouTube Planner 是一个现代化的智能视频内容创作管理系统，专为YouTube创作者设计。它集成了AI文案生成、思维导图可视化编辑、管理员用户管理、脚本管理等多项先进功能，帮助创作者从创意构思到内容发布的全流程管理，显著提升内容创作效率。

### 🌟 核心价值

- **🤖 AI智能创作**: 集成OpenAI、Claude等多种AI服务，支持流式文案生成
- **🧠 可视化构思**: 交互式思维导图编辑器，让创意可视化
- **👥 权限管理**: RBAC角色控制，管理员与普通用户权限分离
- **📝 专业脚本**: 多章节脚本管理，支持实时协作
- **📊 数据驱动**: 完整的创作数据统计和分析
- **🎨 现代设计**: Notion风格的简洁界面，专注创作体验

## ✨ 功能特性

### 🏠 智能首页
- **产品展示**: 直观的功能介绍和价值展示
- **数据统计**: 实时用户数据和创作统计
- **用户评价**: 真实用户反馈和社会证明
- **响应式设计**: 完美适配桌面端和移动端
- **智能导航**: 根据登录状态动态显示功能入口

### 🤖 AI智能文案生成系统
- **多AI服务支持**: 
  - OpenAI GPT系列模型
  - Anthropic Claude系列模型
  - 自定义API接口支持
- **三种生成模式**: 
  - 简化模式：快速生成，格式简洁
  - 标准模式：结构完整，内容丰富
  - 专业模式：深度定制，专业脚本
- **流式输出**: 实时显示生成过程，自动滚动
- **智能解析**: 自动识别标题、简介、章节内容
- **配置管理**: 灵活的API配置和密钥管理
- **使用统计**: API调用次数和成本监控

### 🧠 思维导图编辑器
- **可视化编辑**: 
  - React Flow专业图形编辑引擎
  - 拖拽式节点编辑，支持无限层级
  - 实时编辑，Enter保存，ESC取消
  - 节点添加/删除/编辑功能
- **智能布局**: 
  - 自动水平/垂直布局算法
  - 手动拖拽调整位置
  - 一键整理和优化布局
- **数据同步**: 思维导图标题与根节点双向同步
- **导出功能**: 支持多种格式导出和分享

### 📚 思维导图历史管理
- **版本控制**: 完整的创作历史记录
- **快速检索**: 按标题、日期、标签搜索
- **批量操作**: 导出、删除、分享等批量操作
- **预览模式**: 快速预览思维导图内容
- **数据统计**: 创作时间、节点数量等统计信息

### 👥 管理员用户管理系统
- **权限控制**: 
  - RBAC角色权限控制（管理员/普通用户）
  - 管理员专用用户管理界面
  - 路由级权限保护
- **用户管理**: 
  - 用户列表分页、搜索、排序
  - 用户信息编辑和角色管理
  - 用户状态控制和权限分配
- **安全控制**: 
  - 管理员不能删除/修改自己
  - 不能删除最后一个管理员
  - 操作日志和审计追踪
- **响应式设计**: 桌面端表格视图，移动端卡片视图

### 📝 专业脚本管理系统

#### 脚本编辑器
- **Notion风格**: 简洁优雅的编辑界面
- **多章节支持**: 无限章节，自动编号管理
- **实时保存**: 10秒防抖自动保存，避免数据丢失
- **字数统计**: 实时字数统计和内容分析
- **多标题支持**: 主标题 + 2个备选标题
- **属性管理**: 状态、难度、频道、分类等属性

#### 高级筛选系统
- **多维度筛选**: 
  - 关键词搜索（标题、内容）
  - 频道筛选
  - 分类筛选  
  - 状态筛选（编写中/审核中/已完成）
  - 难度筛选（1-5星）
  - 日期范围筛选
- **智能排序**: 按创建时间、更新时间、标题等排序
- **分页展示**: 高性能分页，支持大数据量
- **批量操作**: 多选操作，批量修改状态

#### 脚本预览
- **专业排版**: 优化的阅读体验
- **章节导航**: 快速跳转到指定章节
- **打印友好**: 支持打印和PDF导出
- **分享功能**: 生成分享链接，团队协作

### 🏢 频道管理
- **多频道支持**: 管理多个YouTube频道
- **频道信息**: 详细的频道描述和设置
- **脚本关联**: 查看频道下的所有脚本
- **数据统计**: 频道脚本数量、状态分布
- **批量操作**: 频道间脚本迁移和管理

### 🏷️ 分类管理
- **灵活分类**: 自定义内容分类体系
- **层级管理**: 支持多层级分类结构
- **智能标签**: 自动标签建议和管理
- **统计分析**: 各分类下的内容数量和趋势
- **快速筛选**: 一键筛选特定分类内容

### 👤 用户管理系统
- **个人信息**: 完整的用户资料管理
- **API配置**: 
  - 支持OpenAI、Claude、自定义API
  - 安全的密钥存储和管理
  - API使用量统计和监控
- **偏好设置**: 个性化的界面和功能设置
- **数据导出**: 支持个人数据导出和备份

## 🛠️ 技术架构

### 前端技术栈
```
React 18.2.0           # 现代化React框架，支持并发特性
TypeScript 4.9+        # 类型安全的JavaScript
Material-UI 5.x        # 谷歌Material Design组件库
React Router 6.x       # 现代化路由管理 + 权限保护
React Flow 11.x        # 专业的流程图和思维导图库
Framer Motion          # 流畅的动画效果
Notistack             # 优雅的通知系统
Axios                 # HTTP请求库 + 自动Token刷新
Date-fns              # 现代化日期处理
```

### 项目结构
```
src/
├── components/                 # 核心组件
│   ├── HomePage.tsx           # 产品首页
│   ├── Layout.tsx             # 主布局组件
│   ├── Login.tsx              # 用户登录
│   ├── Register.tsx           # 用户注册
│   ├── UserManagement.tsx     # 用户管理
│   ├── AdminRoute.tsx         # 管理员路由保护
│   ├── AdminUserManagement.tsx # 管理员用户管理
│   ├── MindMapEditor.tsx      # 思维导图编辑器
│   ├── MindMapHistory.tsx     # 思维导图历史
│   ├── ScriptManagement.tsx   # 脚本管理
│   ├── ScriptEdit.tsx         # 脚本编辑器
│   ├── ScriptPreview.tsx      # 脚本预览
│   ├── ChannelList.tsx        # 频道管理
│   ├── CategoryManagement.tsx # 分类管理
│   └── ProtectedRoute.tsx     # 路由保护
├── contexts/                   # React上下文
│   └── AuthContext.tsx        # 认证上下文
├── services/                   # API服务层
│   ├── api.ts                 # API接口定义
│   └── logger.ts              # 日志服务
├── prompts/                    # AI提示词管理
│   ├── index.ts               # 提示词索引
│   └── videoScriptPrompt.ts   # 视频脚本提示词
├── theme.ts                    # Material-UI主题
└── index.tsx                   # 应用入口
```

### 核心路由
```
/                    # 产品首页（公开访问）
/login              # 用户登录
/register           # 用户注册
/users              # 用户管理中心
/admin/users        # 管理员用户管理（仅管理员）
/mindmap/editor     # 思维导图编辑器
/mindmap/history    # 思维导图历史
/scripts            # 脚本管理中心
/scripts/create     # 创建新脚本
/scripts/:id/edit   # 编辑脚本
/scripts/:id/preview # 预览脚本
/channels           # 频道管理
/categories         # 分类管理
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- npm >= 8.x 或 yarn >= 1.x
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/sanuei/YoutubePlanner.git
cd YoutubePlanner/frontendytp
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
# REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
# REACT_APP_APP_NAME=YouTube Planner
```

4. **启动开发服务器**
```bash
npm start
# 或
yarn start
```

5. **访问应用**
```
http://localhost:3000
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

## 📖 使用指南

### 1. 用户注册和登录
1. 访问应用首页
2. 点击"注册"按钮创建账户
3. 使用用户名/邮箱和密码登录
4. 系统自动处理JWT Token刷新

### 2. 管理员功能（仅管理员）
1. 使用管理员账户登录（sonic_yann / Sonic666.）
2. 在导航菜单中点击"用户管理"
3. 查看所有用户列表
4. 编辑用户信息、修改角色
5. 删除用户（安全限制保护）

### 3. 创建思维导图
1. 访问思维导图编辑器
2. 点击中心节点编辑主题
3. 使用绿色+按钮添加子分支
4. 拖拽节点调整布局
5. 使用自动布局优化结构

### 4. AI生成视频文案
1. 在思维导图中构建内容结构
2. 选择AI生成模式（简化/标准/专业）
3. 配置API密钥（OpenAI/Claude）
4. 点击"AI生成文案"按钮
5. 实时查看生成过程
6. 保存为脚本继续编辑

### 5. 脚本编辑与管理
1. 从思维导图保存或直接创建脚本
2. 使用Notion风格编辑器编写内容
3. 添加多个章节和备选标题
4. 设置属性（状态、难度、分类等）
5. 自动保存，实时字数统计
6. 预览和分享最终脚本

### 6. 高级筛选和搜索
1. 使用多维度筛选器
2. 组合关键词和属性筛选
3. 自定义排序方式
4. 保存常用筛选条件
5. 批量操作管理内容

## 🔧 配置说明

### API配置
在用户管理页面配置AI服务：

```javascript
// OpenAI配置示例
{
  "provider": "openai",
  "apiKey": "sk-xxx...",
  "baseUrl": "https://api.openai.com/v1",
  "model": "gpt-3.5-turbo"
}

// Claude配置示例
{
  "provider": "claude",
  "apiKey": "sk-ant-xxx...",
  "baseUrl": "https://api.anthropic.com/v1",
  "model": "claude-3-sonnet-20240229"
}
```

### 权限配置
```typescript
// 管理员路由保护
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

### 主题定制
```typescript
// src/theme.ts
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 主色调
    },
    secondary: {
      main: '#dc004e', // 辅助色
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

## 📊 API文档

### 认证相关API

#### 用户登录
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### Token刷新
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 管理员API

#### 获取用户列表
```http
GET /api/v1/admin/users?page=1&limit=10&search=关键词
Authorization: Bearer {access_token}
```

#### 更新用户信息
```http
PUT /api/v1/admin/users/{userId}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com",
  "role": "USER"
}
```

### 思维导图API

#### 创建思维导图
```http
POST /api/v1/mindmaps
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "我的思维导图",
  "description": "描述",
  "nodesData": "[{\"id\":\"root\",\"type\":\"mindMapNode\",...}]",
  "edgesData": "[{\"id\":\"edge-1\",\"source\":\"root\",...}]"
}
```

### 脚本管理API

#### 获取脚本列表
```http
GET /api/v1/scripts?page=1&limit=10&search=关键词
Authorization: Bearer {access_token}
```

#### 创建脚本
```http
POST /api/v1/scripts
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "脚本标题",
  "description": "脚本描述",
  "chapters": [
    {
      "chapter_number": 1,
      "title": "第一章",
      "content": "章节内容"
    }
  ]
}
```

#### 更新脚本
```http
PUT /api/v1/scripts/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "更新后的标题",
  "status": "Completed"
}
```

更多API文档请参考：[后端API详细文档](../BackendYTP/README.md)

## 🎨 界面展示

### 首页展示
![首页](./docs/images/homepage.png)

### 思维导图编辑器
![思维导图](./docs/images/mindmap-editor.png)

### AI文案生成
![AI生成](./docs/images/ai-generation.png)

### 脚本管理
![脚本管理](./docs/images/script-management.png)

### 管理员用户管理
![用户管理](./docs/images/admin-user-management.png)

## 🔐 安全特性

### 前端安全
- **JWT Token管理**: 安全存储和自动刷新
- **路由权限保护**: 基于角色的路由访问控制
- **输入验证**: 客户端数据验证
- **XSS防护**: 安全的数据渲染

### 权限控制
```typescript
// 权限检查Hook
const usePermission = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    switch (permission) {
      case 'admin':
        return user.role === 'ADMIN';
      case 'user':
        return user.role === 'USER' || user.role === 'ADMIN';
      default:
        return false;
    }
  };
  
  return { hasPermission };
};
```

## 📈 性能优化

### React优化
```typescript
// 组件优化
const ScriptListItem = React.memo(({ script }: { script: Script }) => {
  return (
    <div className="script-item">
      {script.title}
    </div>
  );
});

// 状态更新优化
const handleNavigation = (path: string) => {
  startTransition(() => {
    navigate(path);
    setActiveTab(path);
  });
};
```

### 网络优化
- **请求去重**: 防止重复API调用
- **缓存策略**: 合理的数据缓存
- **分页加载**: 大数据量分页处理
- **图片优化**: 压缩和懒加载

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 规则
- 编写有意义的提交信息
- 为新功能添加测试用例
- 更新相关文档

### 问题反馈
- 使用 [GitHub Issues](https://github.com/sanuei/YoutubePlanner/issues) 报告Bug
- 使用 [GitHub Discussions](https://github.com/sanuei/YoutubePlanner/discussions) 讨论功能需求
- 查看 [FAQ](./docs/faq.md) 获取常见问题解答

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- **项目主页**: [https://github.com/sanuei/YoutubePlanner](https://github.com/sanuei/YoutubePlanner)
- **在线演示**: [https://youtubeplanner.duckdns.org/](https://youtubeplanner.duckdns.org/)
- **作者YouTube**: [https://www.youtube.com/@sonicyann](https://www.youtube.com/@sonicyann)
- **作者Instagram**: [https://www.instagram.com/sonic_yann/](https://www.instagram.com/sonic_yann/)

## 📞 联系我们

如有任何问题或建议，欢迎通过以下方式联系：

- **GitHub Issues**: [提交问题](https://github.com/sanuei/YoutubePlanner/issues)
- **Email**: sanuei.yann@gmail.com
- **YouTube**: [@sonicyann](https://www.youtube.com/@sonicyann)
- **Instagram**: [@sonic_yann](https://www.instagram.com/sonic_yann/)

## 🎯 项目亮点

### 技术创新
- **AI智能创作**: 集成多种AI服务，支持流式文案生成
- **可视化编辑**: React Flow思维导图编辑器
- **权限管理**: 完整的RBAC角色控制系统
- **现代技术栈**: React 18 + TypeScript + Material-UI

### 工程实践
- **自动化部署**: GitHub Actions + Docker容器化
- **安全设计**: JWT + 权限控制 + 输入验证
- **性能优化**: React.memo + 分页查询 + 缓存策略
- **代码质量**: TypeScript + ESLint + 统一规范

### 用户体验
- **响应式设计**: 桌面端和移动端完美适配
- **实时反馈**: 流式输出 + 自动保存 + 即时通知
- **直观操作**: 拖拽编辑 + 快捷键支持 + 一键操作
- **智能辅助**: AI文案生成 + 自动布局 + 智能提示

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个Star！⭐**

Made with ❤️ by [Yann](https://github.com/sanuei)

**技术栈**: React 18 + TypeScript + Material-UI + React Flow + AI集成

</div>
