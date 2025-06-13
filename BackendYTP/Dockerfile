# 使用支持多架构的OpenJDK 17基础镜像
FROM amazoncorretto:17-alpine

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

# 复制构建参数
ARG JAR_FILE
COPY ${JAR_FILE} app.jar

# 验证JAR文件
RUN ls -l app.jar && \
    echo "JAR file size: $(stat -f %z app.jar || stat -c %s app.jar) bytes" && \
    jar tf app.jar || echo "JAR file validation failed"

# 切换到非root用户
USER spring:spring

# 暴露端口
EXPOSE 8080

# 设置JVM参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -Djava.security.egd=file:/dev/./urandom"

# 启动命令
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 