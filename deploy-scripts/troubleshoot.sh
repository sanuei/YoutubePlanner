#!/bin/bash

echo "=== YouTube Planner 部署故障排除 ==="
echo "时间: $(date)"
echo

echo "1. 检查Docker服务状态..."
sudo systemctl status docker

echo
echo "2. 检查Docker Compose服务状态..."
cd /home/ec2-user/youtubeplanner
docker-compose -f docker-compose.prod.yml ps

echo
echo "3. 检查容器日志..."
echo "--- 前端日志 ---"
docker-compose -f docker-compose.prod.yml logs --tail=20 frontend

echo
echo "--- 后端日志 ---"
docker-compose -f docker-compose.prod.yml logs --tail=20 backend

echo
echo "--- 数据库日志 ---"
docker-compose -f docker-compose.prod.yml logs --tail=20 db

echo
echo "4. 检查端口监听状态..."
sudo netstat -tlnp | grep -E '(80|8080|3306|3000)'

echo
echo "5. 检查防火墙状态..."
sudo iptables -L -n

echo
echo "6. 检查磁盘空间..."
df -h

echo
echo "7. 检查内存使用..."
free -h

echo
echo "8. 检查环境变量文件..."
if [ -f .env ]; then
    echo ".env 文件存在"
    echo "内容预览 (隐藏敏感信息):"
    sed 's/=.*/=***/' .env
else
    echo ".env 文件不存在!"
fi

echo
echo "9. 测试本地连接..."
echo "测试后端健康检查:"
curl -s http://localhost:8080/actuator/health || echo "后端连接失败"

echo
echo "测试前端连接:"
curl -s -I http://localhost:80 || echo "前端连接失败"

echo
echo "=== 故障排除完成 ===" 