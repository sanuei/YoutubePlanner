#!/bin/bash

echo "=== YouTube Planner 快速修复脚本 ==="
echo "时间: $(date)"
echo

cd /home/ec2-user/youtubeplanner

echo "1. 停止所有服务..."
docker-compose -f docker-compose.prod.yml down

echo
echo "2. 清理Docker资源..."
docker system prune -f
docker volume prune -f

echo
echo "3. 检查并创建必要的目录..."
mkdir -p mysql-data
mkdir -p logs

echo
echo "4. 设置正确的权限..."
sudo chown -R ec2-user:ec2-user .
chmod +x deploy-scripts/*.sh

echo
echo "5. 检查环境变量文件..."
if [ ! -f .env ]; then
    echo "创建默认 .env 文件..."
    cat > .env << EOF
# 数据库配置
MYSQL_ROOT_PASSWORD=rootpassword123
MYSQL_DATABASE=youtubeplanner
MYSQL_USER=ytpuser
MYSQL_PASSWORD=ytppassword123

# 后端配置
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/youtubeplanner?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=ytpuser
SPRING_DATASOURCE_PASSWORD=ytppassword123
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# 前端配置
REACT_APP_API_BASE_URL=http://35.77.213.182:8080

# 其他配置
TZ=Asia/Tokyo
EOF
    echo ".env 文件已创建"
else
    echo ".env 文件已存在"
fi

echo
echo "6. 重新启动服务..."
docker-compose -f docker-compose.prod.yml up -d

echo
echo "7. 等待服务启动..."
sleep 30

echo
echo "8. 检查服务状态..."
docker-compose -f docker-compose.prod.yml ps

echo
echo "9. 检查端口监听..."
sudo netstat -tlnp | grep -E '(80|8080)'

echo
echo "10. 测试服务连接..."
echo "测试后端健康检查:"
for i in {1..5}; do
    if curl -s http://localhost:8080/actuator/health; then
        echo "后端服务正常"
        break
    else
        echo "尝试 $i/5: 后端服务未就绪，等待10秒..."
        sleep 10
    fi
done

echo
echo "测试前端连接:"
curl -s -I http://localhost:80 && echo "前端服务正常" || echo "前端服务异常"

echo
echo "=== 快速修复完成 ==="
echo "如果服务仍然无法访问，请检查AWS安全组设置"
echo "需要开放端口: 22, 80, 8080" 