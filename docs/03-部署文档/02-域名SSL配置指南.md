# 域名设置指南

## 🆓 推荐方案：DuckDNS (完全免费)

### 步骤1：注册DuckDNS域名
1. 访问 https://www.duckdns.org
2. 使用GitHub/Google账号登录
3. 创建一个子域名，比如: `youtubeplanner.duckdns.org`
4. 将IP地址设置为: `35.77.213.182`
5. 记录你的token

### 步骤2：在EC2上设置自动更新脚本
```bash
# 登录EC2
ssh -i ".././test.pem" ec2-user@ec2-35-77-213-182.ap-northeast-1.compute.amazonaws.com

# 创建DuckDNS目录
mkdir -p ~/duckdns

# 创建更新脚本 (已配置为youtubeplanner域名)
echo 'echo url="https://www.duckdns.org/update?domains=youtubeplanner&token=2a6b1938-8078-4553-a435-af0b72dfd3c6&ip=" | curl -k -o ~/duckdns/duck.log -K -' > ~/duckdns/duck.sh
chmod 700 ~/duckdns/duck.sh

# 设置定时任务（每5分钟更新一次）
crontab -e
# 添加这行：
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

### 步骤3：配置Nginx反向代理（可选）
```bash
# 在EC2上创建nginx配置
sudo mkdir -p /etc/nginx/sites-available
sudo tee /etc/nginx/sites-available/youtubeplanner << EOF
server {
    listen 80;
    server_name youtubeplanner.duckdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/youtubeplanner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 免费SSL证书 (Let's Encrypt)

### 使用Certbot获取SSL证书
```bash
# 安装certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d youtubeplanner.duckdns.org

# 设置自动续期
sudo crontab -e
# 添加：
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🌐 其他免费域名选项

### Freenom (.tk, .ml, .ga, .cf)
1. 访问 https://www.freenom.com
2. 搜索可用域名
3. 注册免费域名
4. 在DNS设置中添加A记录指向 `35.77.213.182`

### No-IP (动态DNS)
1. 访问 https://www.noip.com
2. 注册免费账号
3. 创建hostname，如 `yourapp.ddns.net`
4. 下载并安装DUC客户端到EC2

## 📝 域名设置完成后

1. 更新前端环境变量：
```bash
REACT_APP_API_BASE_URL=https://yourdomain.com/api/v1
```

2. 更新后端CORS配置：
```bash
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

3. 重新部署应用

## 🎯 推荐配置

对于个人项目，我推荐：
1. **DuckDNS** - 免费且稳定
2. **Let's Encrypt** - 免费SSL证书
3. **Nginx反向代理** - 更好的性能和安全性

这样你就可以通过 `https://youtubeplanner.duckdns.org` 访问你的应用了！ 