#!/bin/bash

# EC2实例初始化脚本
# 用于在新的EC2实例上安装必要的软件

set -e

echo "开始设置EC2实例..."

# 更新系统
sudo yum update -y

# 安装Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 创建符号链接
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# 安装其他必要工具
sudo yum install -y git curl wget htop

# 创建应用目录
mkdir -p /home/ec2-user/youtubeplanner
cd /home/ec2-user/youtubeplanner

# 创建环境变量文件
cat > .env << EOF
# 数据库配置
DATABASE_URL=jdbc:postgresql://your-db-host:5432/your-db-name
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-db-password

# JWT配置
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# EC2公网IP (需要手动更新)
EC2_PUBLIC_IP=\$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
EOF

# 设置防火墙规则 (如果使用iptables)
# sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
# sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
# sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
# sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

echo "EC2实例设置完成！"
echo "请确保在AWS安全组中开放以下端口："
echo "- 80 (HTTP)"
echo "- 443 (HTTPS)"
echo "- 8080 (后端API)"
echo "- 3000 (前端开发端口)"
echo ""
echo "请手动编辑 .env 文件，填入正确的数据库连接信息" 