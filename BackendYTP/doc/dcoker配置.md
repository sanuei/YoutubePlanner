好的，我来帮您配置Docker相关的内容。

1. 首先修改 `pom.xml`，添加Docker相关插件：

2. 创建 Dockerfile：

3. 创建 `.dockerignore` 文件以排除不必要的文件：

现在您可以使用以下命令来构建和运行Docker镜像：

1. 构建项目并创建Docker镜像：
```bash
# 清理并构建项目
mvn clean package

# 构建Docker镜像
mvn dockerfile:build
```

2. 运行Docker容器：
```bash
# 开发环境
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=OtvO9P8X36b3up5x \
  --name youtube-planner-dev \
  youtube-planner:0.0.1-SNAPSHOT

# 生产环境
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=your_prod_db_url \
  -e DB_USERNAME=your_prod_username \
  -e DB_PASSWORD=your_prod_password \
  -e JWT_SECRET=your_jwt_secret \
  --name youtube-planner-prod \
  youtube-planner:0.0.1-SNAPSHOT
```

3. 查看容器日志：
```bash
docker logs -f youtube-planner-dev
```

4. 停止和删除容器：
```bash
docker stop youtube-planner-dev
docker rm youtube-planner-dev
```

Dockerfile的主要特点：
1. 使用轻量级的Alpine Linux基础镜像
2. 设置正确的时区
3. 使用非root用户运行应用
4. 配置JVM参数优化性能
5. 支持环境变量配置

您需要我详细解释任何部分吗？或者需要添加其他Docker相关的配置？