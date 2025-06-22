# YouTube Planner

一个现代化的YouTube智能视频内容创作管理系统，集成AI文案生成、思维导图编辑、管理员系统等先进功能，帮助创作者高效管理频道内容和视频脚本。

## 🌟 项目特色

- **🤖 AI智能创作** - 集成OpenAI、Claude等多种AI服务，支持流式文案生成
- **🧠 思维导图编辑器** - React Flow可视化编辑器，拖拽式节点操作
- **👥 管理员系统** - RBAC角色权限控制，完整的用户管理功能
- **📝 智能脚本管理** - 支持多章节、状态跟踪、难度分级
- **🎨 现代化UI设计** - 基于Material-UI的响应式界面
- **☁️ 云端部署** - 基于AWS EC2的生产级部署
- **🔄 自动化CI/CD** - GitHub Actions自动构建和部署

## 🚀 快速开始

### 生产环境访问
**在线地址**: https://youtubeplanner.duckdns.org


### 生产环境部署
```bash
# 克隆项目
git clone https://github.com/sanuei/YoutubePlanner.git
cd YoutubePlanner

# 部署到生产环境
docker-compose -f docker-compose.prod.yml up -d
```

### 开发环境
```bash
# 启动开发环境
docker-compose up -d
```

### 本地开发
```bash
# 后端开发
cd BackendYTP
mvn spring-boot:run

# 前端开发
cd frontendytp
npm install
npm start
```

## 🏗️ 技术架构

### 前端技术栈
- **React 18** - 现代化前端框架，支持并发特性
- **TypeScript 4.9** - 类型安全的JavaScript
- **Material-UI 5.x** - 企业级UI组件库
- **React Router 6.3** - 客户端路由 + 权限保护
- **React Flow 11.x** - 专业思维导图编辑器
- **Framer Motion** - 流畅的动画效果
- **Axios** - HTTP客户端 + 自动Token刷新

### 后端技术栈
- **Spring Boot 3.2.3** - 企业级Java框架
- **Java 17** - 现代Java版本
- **Spring Security** - 安全认证 + RBAC权限控制
- **Spring Data JPA** - 数据持久化
- **PostgreSQL 15** - 关系型数据库
- **JWT** - 无状态认证 + 自动刷新
- **MyBatis** - SQL映射框架
- **Flyway** - 数据库版本控制
- **Lombok** - 减少样板代码

### 部署和运维
- **Docker** - 容器化部署
- **Docker Compose** - 多容器编排
- **AWS EC2** - 云服务器
- **Nginx** - 反向代理
- **Let's Encrypt** - SSL证书自动续期
- **GitHub Actions** - CI/CD自动化

## 📁 项目结构

```
YoutubePlanner/
├── BackendYTP/              # Spring Boot后端
│   ├── src/main/java/       # Java源代码
│   │   └── com/youtubeplanner/backend/
│   │       ├── user/        # 用户管理模块
│   │       ├── script/      # 脚本管理模块
│   │       ├── mindmap/     # 思维导图模块
│   │       ├── category/    # 分类管理模块
│   │       ├── channel/     # 频道管理模块
│   │       └── security/    # 安全认证模块
│   ├── src/main/resources/  # 配置文件和资源
│   ├── Dockerfile           # 后端容器配置
│   └── pom.xml             # Maven依赖管理
├── frontendytp/             # React前端应用
│   ├── src/components/      # React组件
│   │   ├── MindMapEditor.tsx    # 思维导图编辑器
│   │   ├── AdminUserManagement.tsx # 管理员用户管理
│   │   ├── ScriptManagement.tsx # 脚本管理
│   │   └── ...
│   ├── src/services/        # API服务
│   ├── src/contexts/        # React上下文
│   ├── src/prompts/         # AI提示词管理
│   ├── Dockerfile           # 前端容器配置
│   └── package.json         # npm依赖管理
├── docs/                    # 项目文档
│   ├── 01-项目文档/         # 项目说明文档
│   ├── 02-API文档/          # API接口文档
│   ├── 03-部署文档/         # 部署指南
│   └── 04-配置文档/         # 配置说明
├── deploy-scripts/          # 部署脚本
├── docker-compose.yml       # 开发环境配置
├── docker-compose.prod.yml  # 生产环境配置
└── .github/workflows/       # GitHub Actions工作流
```

## 🔧 核心功能

### 🤖 AI智能文案生成
- ✅ 支持OpenAI、Claude等多种AI服务
- ✅ 三种生成模式：简化/标准/专业
- ✅ 流式输出，实时显示生成过程
- ✅ 智能解析，自动提取标题和章节
- ✅ API配置管理，支持自定义密钥

### 🧠 思维导图编辑器
- ✅ React Flow可视化编辑器
- ✅ 拖拽式节点编辑，支持无限层级
- ✅ 自动布局算法（水平/垂直）
- ✅ 实时编辑，Enter保存，ESC取消
- ✅ 思维导图历史版本管理
- ✅ 节点添加/删除/编辑功能

### 👥 用户管理系统
- ✅ 用户注册和登录
- ✅ JWT身份验证 + 自动Token刷新
- ✅ RBAC角色权限控制（管理员/普通用户）
- ✅ 管理员专用用户管理界面
- ✅ 用户信息编辑和角色管理
- ✅ 个人信息管理和API配置

### 📝 脚本管理系统
- ✅ Notion风格编辑器界面
- ✅ 多章节管理，自动编号
- ✅ 难度等级设置（1-5级）
- ✅ 状态跟踪（草稿、编写中、审核、完成）
- ✅ 发布日期设置
- ✅ 高级筛选和搜索
- ✅ 分页和排序功能
- ✅ 实时保存（10秒防抖）

### 🏢 频道管理
- ✅ 频道创建和编辑
- ✅ 频道信息展示
- ✅ 频道关联脚本统计
- ✅ 多频道支持

### 🏷️ 分类管理
- ✅ 分类创建和编辑
- ✅ 分类关联脚本统计
- ✅ 分类筛选功能
- ✅ 智能标签系统

### 🎨 高级功能
- ✅ 响应式Web界面（桌面端/移动端）
- ✅ 实时数据更新
- ✅ 错误处理和用户反馈
- ✅ 数据可视化统计
- ✅ 权限路由保护
- ✅ 自动化部署和健康检查

## 📝 开发指南

### 环境要求
- **Node.js** >= 18.x
- **Java** >= 17
- **Maven** >= 3.6.x
- **Docker** >= 20.x
- **PostgreSQL** >= 15

### 开发流程
1. **Fork项目** - 创建个人分支
2. **创建特性分支** - `git checkout -b feature/your-feature`
3. **提交更改** - 遵循约定式提交规范
4. **推送到分支** - `git push origin feature/your-feature`
5. **创建Pull Request** - 等待代码审查

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier规则
- 编写单元测试
- 保持代码注释完整
- 使用语义化的提交信息

## 🚀 部署说明

### 自动部署
项目使用GitHub Actions进行CI/CD自动部署：
- 推送到`main`分支自动触发部署
- 支持手动触发部署到不同环境
- 自动构建Docker镜像
- 自动部署到AWS EC2
- 自动健康检查和回滚

### 手动部署
```bash
# 构建镜像
docker build -t youtubeplanner-backend ./BackendYTP
docker build -t youtubeplanner-frontend ./frontendytp

# 启动服务
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 安全特性

- **JWT身份验证** - 无状态的安全认证 + 自动刷新
- **RBAC权限控制** - 基于角色的访问控制
- **HTTPS加密传输** - 全站SSL加密
- **CORS安全配置** - 跨域请求保护
- **SQL注入防护** - 参数化查询
- **输入验证** - 服务端数据验证
- **XSS防护** - 输出编码和过滤
- **密码加密** - BCrypt加密存储

## 📊 性能优化

- **Docker多阶段构建** - 减小镜像体积
- **Nginx反向代理** - 静态资源缓存
- **数据库索引优化** - 查询性能提升
- **前端代码分割** - 按需加载
- **React.memo优化** - 防止不必要渲染
- **分页查询** - 大数据量处理
- **流式输出** - AI生成实时反馈

## 🎯 功能演示

### AI文案生成流程
1. 在思维导图中构建内容结构
2. 选择AI生成模式（简化/标准/专业）
3. 配置API密钥（OpenAI/Claude）
4. 点击"AI生成文案"按钮
5. 实时查看流式生成过程
6. 保存为脚本继续编辑

### 管理员功能
1. 使用管理员账户登录
2. 访问"用户管理"页面
3. 查看所有用户列表
4. 编辑用户信息和角色
5. 管理用户权限

### 思维导图编辑
1. 创建新的思维导图
2. 点击节点进行编辑
3. 使用绿色+按钮添加子节点
4. 拖拽节点调整位置
5. 使用自动布局优化结构

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看以下指南：

### 报告问题
- 使用GitHub Issues报告bug
- 提供详细的复现步骤
- 包含环境信息和错误日志

### 功能建议
- 在Issues中提出新功能建议
- 描述使用场景和预期效果
- 讨论技术实现方案

### 代码贡献
- 遵循项目的代码规范
- 添加必要的测试用例
- 更新相关文档

## 📄 许可证

本项目采用 [MIT](https://opensource.org/licenses/MIT) 许可证。

## 📞 联系方式

- **GitHub**: [https://github.com/sanuei/YoutubePlanner](https://github.com/sanuei/YoutubePlanner)
- **在线演示**: [https://youtubeplanner.duckdns.org](https://youtubeplanner.duckdns.org)
- **YouTube**: [https://www.youtube.com/@sonicyann](https://www.youtube.com/@sonicyann)
- **Instagram**: [https://www.instagram.com/sonic_yann/](https://www.instagram.com/sonic_yann/)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

## 📈 项目亮点

### 技术创新
- **AI智能创作**: 集成多种AI服务，支持流式文案生成
- **可视化编辑**: React Flow思维导图编辑器
- **权限管理**: 完整的RBAC角色控制系统
- **现代技术栈**: React 18 + Spring Boot 3 + PostgreSQL 15

### 工程实践
- **自动化部署**: GitHub Actions + Docker容器化
- **安全设计**: HTTPS + JWT + 权限控制
- **性能优化**: 分页查询 + 前端优化
- **代码质量**: TypeScript + 统一规范

### 用户体验
- **响应式设计**: 桌面端和移动端适配
- **实时反馈**: 流式输出 + 自动保存
- **直观操作**: 拖拽编辑 + 快捷键支持
- **智能辅助**: AI文案生成 + 自动布局

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！

**技术栈**: React 18 + TypeScript + Spring Boot 3 + PostgreSQL + AWS + Docker + AI集成 