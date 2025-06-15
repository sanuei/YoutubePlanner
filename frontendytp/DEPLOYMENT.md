# 🚀 部署配置指南

## 环境变量配置

### 1. 创建环境变量文件

在项目根目录创建以下文件：

#### `.env.production`（生产环境）
```bash
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api/v1
```

#### `.env.staging`（测试环境）
```bash
REACT_APP_API_BASE_URL=https://staging-backend-domain.com/api/v1
```

### 2. 部署时需要修改的配置

#### API基础URL
- **开发环境**: `http://localhost:8080/api/v1`
- **生产环境**: `https://your-backend-domain.com/api/v1`

#### 跨域配置
确保后端服务器配置了正确的CORS设置，允许来自前端域名的请求。

## 构建和部署步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 构建生产版本
```bash
# 使用生产环境变量构建
npm run build

# 或者指定环境文件
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api/v1 npm run build
```

### 3. 部署选项

#### 选项1: 静态文件服务器
```bash
# 安装serve
npm install -g serve

# 启动服务
serve -s build -l 3000
```

#### 选项2: Nginx配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/your/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理（可选）
    location /api/ {
        proxy_pass http://your-backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 选项3: Docker部署
```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 安全配置

### 1. HTTPS配置
- 确保生产环境使用HTTPS
- 更新API_BASE_URL为https://

### 2. 环境变量安全
- 不要在代码中硬编码敏感信息
- 使用环境变量管理配置

### 3. CSP配置
在index.html中添加内容安全策略：
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 性能优化

### 1. 代码分割
项目已使用React.lazy进行代码分割，无需额外配置。

### 2. 缓存策略
配置适当的HTTP缓存头：
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 监控和日志

### 1. 错误监控
考虑集成错误监控服务（如Sentry）：
```bash
npm install @sentry/react
```

### 2. 性能监控
使用Web Vitals监控性能：
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 检查清单

部署前请确认：

- [ ] 环境变量已正确配置
- [ ] API基础URL指向正确的后端地址
- [ ] 后端CORS配置允许前端域名
- [ ] HTTPS证书已配置（生产环境）
- [ ] 构建无错误和警告
- [ ] 所有功能在生产环境中测试通过
- [ ] 错误监控和日志已配置
- [ ] 备份和回滚策略已准备 