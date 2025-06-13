# 使用支持多架构的OpenJDK 17基础镜像
FROM amazoncorretto:17-alpine AS builder

# 设置工作目录
WORKDIR /build

# 复制Maven配置文件
COPY pom.xml .
COPY src ./src

# 安装Maven
RUN apk add --no-cache maven

# 构建项目
RUN mvn clean package -DskipTests -Ddockerfile.skip=true

# 使用新的基础镜像
FROM amazoncorretto:17-alpine

# 安装网络工具用于调试
RUN apk add --no-cache curl net-tools

# 设置工作目录
WORKDIR /app

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建非root用户
RUN addgroup -S spring && adduser -S spring -G spring

# 创建日志目录并设置权限
RUN mkdir -p /app/logs && \
    chown -R spring:spring /app/logs && \
    chmod 755 /app/logs

# 从构建阶段复制JAR文件
COPY --from=builder /build/target/backend-0.0.1-SNAPSHOT.jar app.jar

# 验证JAR文件
RUN ls -l app.jar && \
    echo "JAR file size: $(stat -f %z app.jar || stat -c %s app.jar) bytes" && \
    jar tf app.jar || echo "JAR file validation failed"

# 切换到非root用户
USER spring:spring

# 暴露端口
EXPOSE 10000

# 设置JVM参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -Djava.security.egd=file:/dev/./urandom"

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://0.0.0.0:${PORT:-10000}/health || exit 1

# 启动命令 - 使用jar文件
ENTRYPOINT ["sh", "-c", "echo '=== 启动应用程序 ===' && echo 'PORT环境变量: '${PORT:-10000} && echo '绑定地址: 0.0.0.0' && java $JAVA_OPTS -jar app.jar --server.port=${PORT:-10000} --server.address=0.0.0.0"] 