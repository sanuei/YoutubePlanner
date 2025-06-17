# 第一阶段：构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖（包括开发依赖，构建需要）
RUN npm ci

# 复制源代码
COPY . .

# 设置构建参数
ARG REACT_APP_API_BASE_URL=https://youtubeplanner.duckdns.org/api/v1
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# 构建应用
RUN npm run build

# 第二阶段：运行阶段
FROM nginx:alpine AS runtime

# 安装curl用于健康检查
RUN apk add --no-cache curl

# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制构建结果
COPY --from=builder /app/build /usr/share/nginx/html

# nginx用户已存在，无需创建

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 