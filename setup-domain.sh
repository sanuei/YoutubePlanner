#!/bin/bash

echo "🌐 YouTube Planner 域名设置脚本"
echo "=================================="

# 使用预设的域名和token
echo "使用预设域名和token..."

DOMAIN=youtubeplanner
TOKEN=2a6b1938-8078-4553-a435-af0b72dfd3c6
FULL_DOMAIN="${DOMAIN}.duckdns.org"

echo "设置域名: $FULL_DOMAIN"
echo "Token: ${TOKEN:0:10}..."

# 创建DuckDNS更新脚本
echo "📝 创建DuckDNS更新脚本..."
mkdir -p ~/duckdns
cat > ~/duckdns/duck.sh << EOF
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&ip=" | curl -k -o ~/duckdns/duck.log -K -
EOF

chmod 700 ~/duckdns/duck.sh

# 测试DuckDNS更新
echo "🧪 测试DuckDNS更新..."
~/duckdns/duck.sh
sleep 2

if grep -q "OK" ~/duckdns/duck.log; then
    echo "✅ DuckDNS更新成功"
else
    echo "❌ DuckDNS更新失败，请检查域名和token"
    cat ~/duckdns/duck.log
    exit 1
fi

# 设置定时任务
echo "⏰ 设置定时任务..."
(crontab -l 2>/dev/null; echo "*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1") | crontab -

# 安装Nginx（如果未安装）
if ! command -v nginx &> /dev/null; then
    echo "📦 安装Nginx..."
    sudo yum update -y
    sudo yum install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
fi

# 创建Nginx配置
echo "⚙️ 配置Nginx反向代理..."
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

sudo tee /etc/nginx/sites-available/youtubeplanner << EOF
server {
    listen 80;
    server_name ${FULL_DOMAIN};

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # 后端API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # 健康检查
    location /actuator/health {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
    }
}
EOF

# 启用站点
sudo ln -sf /etc/nginx/sites-available/youtubeplanner /etc/nginx/sites-enabled/

# 更新主Nginx配置以包含sites-enabled
if ! grep -q "include /etc/nginx/sites-enabled" /etc/nginx/nginx.conf; then
    sudo sed -i '/http {/a\    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf
fi

# 测试Nginx配置
echo "🧪 测试Nginx配置..."
if sudo nginx -t; then
    echo "✅ Nginx配置正确"
    sudo systemctl reload nginx
else
    echo "❌ Nginx配置错误"
    exit 1
fi

# 安装Certbot并获取SSL证书
echo "🔒 设置SSL证书..."
if ! command -v certbot &> /dev/null; then
    sudo yum install -y certbot python3-certbot-nginx
fi

# 获取SSL证书
echo "📜 获取Let's Encrypt SSL证书..."
sudo certbot --nginx -d ${FULL_DOMAIN} --non-interactive --agree-tos --email admin@${FULL_DOMAIN}

# 设置SSL证书自动续期
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -

echo ""
echo "🎉 域名设置完成！"
echo "=================================="
echo "域名: https://${FULL_DOMAIN}"
echo "前端: https://${FULL_DOMAIN}"
echo "后端API: https://${FULL_DOMAIN}/api/v1"
echo "健康检查: https://${FULL_DOMAIN}/actuator/health"
echo ""
echo "📝 下一步："
echo "1. 更新前端环境变量 REACT_APP_API_BASE_URL=https://${FULL_DOMAIN}/api/v1"
echo "2. 更新后端CORS配置 CORS_ALLOWED_ORIGINS=https://${FULL_DOMAIN}"
echo "3. 重新部署应用"
echo ""
echo "🔄 DuckDNS会每5分钟自动更新IP地址"
echo "🔒 SSL证书会自动续期" 