# YouTube Planner

一个用于管理YouTube视频脚本的Web应用程序。

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

## 🌐 在线访问

**生产环境**: https://youtubeplanner.duckdns.org

## 🏗️ 技术栈

- **前端**: React + TypeScript
- **后端**: Spring Boot + Java
- **数据库**: PostgreSQL
- **部署**: Docker + AWS EC2
- **反向代理**: Nginx
- **SSL**: Let's Encrypt

## 📁 项目结构

```
├── BackendYTP/          # Spring Boot后端
├── FrontendYTP/         # React前端
├── docker-compose.yml   # 开发环境配置
├── docker-compose.prod.yml # 生产环境配置
├── init-db.sql         # 数据库初始化脚本
└── setup-domain.sh     # 域名和SSL设置脚本
```

## 🔧 主要功能

- 用户认证和授权
- 脚本管理（创建、编辑、删除）
- 频道管理
- 分类管理
- 章节管理
- 响应式Web界面

## 📝 开发说明

项目使用GitHub Actions进行CI/CD自动部署。推送到`clean-deploy`分支会自动触发部署流程。

## 🔒 安全特性

- JWT身份验证
- HTTPS加密传输
- CORS安全配置
- SQL注入防护 