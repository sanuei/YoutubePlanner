#!/bin/bash

# 健康检查脚本
# 检查应用服务是否正常运行

set -e

echo "开始健康检查..."

# 获取EC2公网IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# 检查Docker服务
echo "检查Docker服务状态..."
if ! systemctl is-active --quiet docker; then
    echo "❌ Docker服务未运行"
    exit 1
else
    echo "✅ Docker服务正常"
fi

# 检查容器状态
echo "检查容器状态..."
cd /home/ec2-user/youtubeplanner

if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "❌ 容器未正常运行"
    docker-compose -f docker-compose.prod.yml ps
    exit 1
else
    echo "✅ 容器状态正常"
fi

# 检查后端API
echo "检查后端API..."
if curl -f -s "http://localhost:8080/actuator/health" > /dev/null; then
    echo "✅ 后端API健康检查通过"
else
    echo "❌ 后端API健康检查失败"
    exit 1
fi

# 检查前端服务
echo "检查前端服务..."
if curl -f -s "http://localhost:80/" > /dev/null; then
    echo "✅ 前端服务正常"
else
    echo "❌ 前端服务异常"
    exit 1
fi

# 显示服务访问地址
echo ""
echo "🎉 所有服务健康检查通过！"
echo "服务访问地址："
echo "- 前端: http://${EC2_IP}"
echo "- 后端API: http://${EC2_IP}:8080"
echo "- 健康检查: http://${EC2_IP}:8080/actuator/health" 