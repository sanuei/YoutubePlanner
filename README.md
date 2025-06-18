# YouTube Planner

一个现代化的YouTube视频脚本管理系统，帮助创作者高效管理频道内容和视频脚本。

## 🌟 项目特色

- **现代化UI设计** - 基于Material-UI的响应式界面
- **完整的脚本管理** - 支持多章节、状态跟踪、难度分级
- **智能分类系统** - 灵活的频道和分类管理
- **实时协作** - 支持多用户同时编辑
- **云端部署** - 基于AWS EC2的生产级部署
- **自动化CI/CD** - GitHub Actions自动构建和部署

## 🚀 快速开始

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

## 🌐 在线访问

**生产环境**: https://youtubeplanner.duckdns.org

## 🏗️ 技术架构

### 前端技术栈
- **React 18** - 现代化前端框架
- **TypeScript 4.9** - 类型安全的JavaScript
- **Material-UI 7.1** - 企业级UI组件库
- **React Router 6.3** - 客户端路由
- **Framer Motion** - 流畅的动画效果
- **Axios** - HTTP客户端
- **Recharts** - 数据可视化

### 后端技术栈
- **Spring Boot 3.2.3** - 企业级Java框架
- **Java 17** - 现代Java版本
- **Spring Security** - 安全认证
- **Spring Data JPA** - 数据持久化
- **PostgreSQL** - 关系型数据库
- **JWT** - 无状态认证
- **MyBatis** - SQL映射框架
- **Lombok** - 减少样板代码

### 部署和运维
- **Docker** - 容器化部署
- **Docker Compose** - 多容器编排
- **AWS EC2** - 云服务器
- **Nginx** - 反向代理
- **Let's Encrypt** - SSL证书
- **GitHub Actions** - CI/CD自动化

## 📁 项目结构

```
YoutubePlanner/
├── BackendYTP/              # Spring Boot后端
│   ├── src/main/java/       # Java源代码
│   ├── src/main/resources/  # 配置文件和资源
│   ├── Dockerfile           # 后端容器配置
│   └── pom.xml             # Maven依赖管理
├── frontendytp/             # React前端应用
│   ├── src/components/      # React组件
│   ├── src/services/        # API服务
│   ├── src/contexts/        # React上下文
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

### 用户系统
- ✅ 用户注册和登录
- ✅ JWT身份验证
- ✅ 个人信息管理
- ✅ 密码修改

### 频道管理
- ✅ 频道创建和编辑
- ✅ 频道信息展示
- ✅ 频道关联脚本统计
- ✅ 频道分类管理

### 分类管理
- ✅ 分类创建和编辑
- ✅ 分类关联脚本统计
- ✅ 分类筛选功能

### 脚本管理
- ✅ 脚本创建和编辑
- ✅ 多章节管理
- ✅ 难度等级设置（1-5级）
- ✅ 状态跟踪（草稿、编写中、审核、完成）
- ✅ 发布日期设置
- ✅ 高级筛选和搜索
- ✅ 分页和排序功能

### 高级功能
- ✅ 响应式Web界面
- ✅ 实时数据更新
- ✅ 错误处理和用户反馈
- ✅ 数据可视化统计

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

- **JWT身份验证** - 无状态的安全认证
- **HTTPS加密传输** - 全站SSL加密
- **CORS安全配置** - 跨域请求保护
- **SQL注入防护** - 参数化查询
- **输入验证** - 服务端数据验证
- **XSS防护** - 输出编码和过滤

## 📊 性能优化

- **Docker多阶段构建** - 减小镜像体积
- **Nginx反向代理** - 静态资源缓存
- **数据库索引优化** - 查询性能提升
- **前端代码分割** - 按需加载
- **CDN加速** - 静态资源分发

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
- **YouTube**: [https://www.youtube.com/@sonicyann](https://www.youtube.com/@sonicyann)
- **Instagram**: [https://www.instagram.com/sonic_yann/](https://www.instagram.com/sonic_yann/)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！ 