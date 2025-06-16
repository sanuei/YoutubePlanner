# AWS EC2 部署指南

本指南将帮助您使用GitHub Actions自动部署YouTube Planner到AWS EC2实例。

## 🚀 部署架构

```
GitHub Repository
       ↓ (Push/PR)
GitHub Actions
       ↓ (Build & Deploy)
AWS EC2 Instance
       ↓ (Docker Containers)
Frontend (Nginx) + Backend (Spring Boot)
```

## 📋 前置要求

### 1. AWS EC2实例
- **实例类型**: t2.micro 或更高 (推荐 t3.small)
- **操作系统**: Amazon Linux 2
- **存储**: 至少 20GB
- **安全组**: 开放端口 22, 80, 443, 8080, 3000

### 2. 数据库
- PostgreSQL数据库 (可使用AWS RDS或Supabase)
- 确保EC2实例可以访问数据库

### 3. GitHub仓库
- 项目代码已推送到GitHub
- 有管理员权限设置Secrets

## 🔧 配置步骤

### 步骤1: 设置EC2实例

1. **启动EC2实例**
   ```bash
   # 连接到EC2实例
   ssh -i "your-key.pem" ec2-user@your-ec2-ip
   ```

2. **运行初始化脚本**
   ```bash
   # 下载并运行设置脚本
   curl -O https://raw.githubusercontent.com/your-username/your-repo/main/deploy-scripts/setup-ec2.sh
   chmod +x setup-ec2.sh
   ./setup-ec2.sh
   ```

3. **配置环境变量**
   ```bash
   cd /home/ec2-user/youtubeplanner
   cp env.example .env
   nano .env  # 编辑数据库连接信息
   ```

### 步骤2: 配置AWS安全组

在AWS控制台中配置安全组规则：

| 类型 | 协议 | 端口范围 | 源 | 描述 |
|------|------|----------|-----|------|
| SSH | TCP | 22 | Your IP | SSH访问 |
| HTTP | TCP | 80 | 0.0.0.0/0 | 前端访问 |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS访问 |
| Custom TCP | TCP | 8080 | 0.0.0.0/0 | 后端API |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | 前端开发端口 |

### 步骤3: 配置GitHub Secrets

在GitHub仓库的Settings > Secrets and variables > Actions中添加：

| Secret名称 | 描述 | 示例值 |
|------------|------|--------|
| `EC2_HOST` | EC2实例公网IP | `35.77.213.182` |
| `EC2_USER` | EC2用户名 | `ec2-user` |
| `EC2_SSH_KEY` | SSH私钥内容 | `-----BEGIN RSA PRIVATE KEY-----...` |

**获取SSH私钥内容：**
```bash
cat your-key.pem
```
复制完整内容（包括BEGIN和END行）到GitHub Secret。

### 步骤4: 配置数据库连接

编辑EC2实例上的环境变量文件：
```bash
ssh -i "your-key.pem" ec2-user@your-ec2-ip
cd /home/ec2-user/youtubeplanner
nano .env
```

更新以下配置：
```env
DATABASE_URL=jdbc:postgresql://your-db-host:5432/your-db-name
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-db-password
```

### 步骤5: 触发部署

1. **推送代码到main或clean-deploy分支**
   ```bash
   git add .
   git commit -m "配置EC2部署"
   git push origin main
   # 或者推送到开发分支
   git push origin clean-deploy
   ```

2. **查看部署状态**
   - 访问GitHub仓库的Actions页面
   - 查看部署工作流的执行状态

## 🔍 验证部署

### 1. 检查服务状态
```bash
ssh -i "your-key.pem" ec2-user@your-ec2-ip
cd /home/ec2-user/youtubeplanner
./deploy-scripts/health-check.sh
```

### 2. 访问应用
- **前端**: http://your-ec2-ip
- **后端API**: http://your-ec2-ip:8080
- **健康检查**: http://your-ec2-ip:8080/actuator/health

### 3. 查看日志
```bash
# 查看容器日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

## 🛠️ 常用运维命令

### 重启服务
```bash
cd /home/ec2-user/youtubeplanner
docker-compose -f docker-compose.prod.yml restart
```

### 更新应用
```bash
# 拉取最新镜像
docker-compose -f docker-compose.prod.yml pull

# 重新启动服务
docker-compose -f docker-compose.prod.yml up -d
```

### 备份数据
```bash
./deploy-scripts/backup.sh
```

### 查看系统资源
```bash
# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看CPU使用
htop
```

## 🔧 故障排除

### 1. 部署失败
- 检查GitHub Actions日志
- 确认SSH连接正常
- 验证EC2实例Docker服务状态

### 2. 服务无法访问
- 检查安全组配置
- 确认容器状态：`docker ps`
- 查看服务日志

### 3. 数据库连接失败
- 验证数据库连接信息
- 检查网络连通性
- 确认数据库服务状态

### 4. 内存不足
```bash
# 清理Docker镜像
docker system prune -a

# 增加swap空间
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1048576
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📊 监控和日志

### 1. 应用监控
- Spring Boot Actuator: http://your-ec2-ip:8080/actuator
- 健康检查: http://your-ec2-ip:8080/actuator/health
- 指标监控: http://your-ec2-ip:8080/actuator/metrics

### 2. 日志管理
```bash
# 查看应用日志
docker-compose -f docker-compose.prod.yml logs --tail=100 -f

# 查看系统日志
sudo journalctl -u docker -f
```

## 🔒 安全建议

1. **定期更新系统**
   ```bash
   sudo yum update -y
   ```

2. **配置防火墙**
   ```bash
   sudo systemctl enable firewalld
   sudo systemctl start firewalld
   sudo firewall-cmd --permanent --add-port=80/tcp
   sudo firewall-cmd --permanent --add-port=443/tcp
   sudo firewall-cmd --permanent --add-port=8080/tcp
   sudo firewall-cmd --reload
   ```

3. **SSL证书配置**
   - 使用Let's Encrypt获取免费SSL证书
   - 配置Nginx反向代理

4. **定期备份**
   - 设置cron任务自动备份
   - 备份到S3或其他云存储

## 📈 性能优化

1. **Docker优化**
   ```bash
   # 限制容器资源使用
   docker-compose -f docker-compose.prod.yml up -d --scale backend=1 --scale frontend=1
   ```

2. **数据库优化**
   - 配置连接池
   - 优化查询语句
   - 定期维护数据库

3. **缓存策略**
   - 配置Redis缓存
   - 启用HTTP缓存头

## 🆘 紧急恢复

如果服务出现问题，可以快速恢复：

```bash
# 停止所有服务
docker-compose -f docker-compose.prod.yml down

# 恢复备份
cd /home/ec2-user/backups
tar xzf latest_backup.tar.gz
cd youtubeplanner_backup_*
docker load < backend_image.tar.gz
docker load < frontend_image.tar.gz

# 重新启动
cd /home/ec2-user/youtubeplanner
docker-compose -f docker-compose.prod.yml up -d
```

---

**部署完成后，您的应用将在以下地址可用：**
- 🌐 前端应用: https://youtubeplanner.duckdns.org
- 🔧 后端API: https://youtubeplanner.duckdns.org/api/v1
- 📊 健康检查: https://youtubeplanner.duckdns.org/actuator/health
- 🔗 备用访问: http://35.77.213.182 (直接IP访问) 