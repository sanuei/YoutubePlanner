#!/bin/bash

# YouTube Planner 部署脚本

set -e

echo "🚀 YouTube Planner 部署脚本"
echo "================================"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查docker-compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 函数：本地测试部署
local_deploy() {
    echo "🏠 启动本地测试环境..."
    
    # 构建并启动服务
    docker-compose up --build -d
    
    echo "✅ 本地部署完成！"
    echo "前端地址: http://localhost:3000"
    echo "后端地址: http://localhost:8080"
    echo "健康检查: http://localhost:8080/actuator/health"
    echo ""
    echo "查看日志: docker-compose logs -f"
    echo "停止服务: docker-compose down"
}

# 函数：构建Docker镜像
build_images() {
    echo "🔨 构建Docker镜像..."
    
    # 构建后端镜像
    echo "构建后端镜像..."
    docker build -t youtubeplanner-backend:latest ./BackendYTP
    
    # 构建前端镜像
    echo "构建前端镜像..."
    docker build -t youtubeplanner-frontend:latest ./frontendytp
    
    echo "✅ 镜像构建完成！"
}

# 函数：清理Docker资源
cleanup() {
    echo "🧹 清理Docker资源..."
    
    # 停止容器
    docker-compose down
    
    # 删除未使用的镜像
    docker image prune -f
    
    # 删除未使用的卷
    docker volume prune -f
    
    echo "✅ 清理完成！"
}

# 函数：显示帮助信息
show_help() {
    echo "使用方法:"
    echo "  ./deploy.sh local    - 本地测试部署"
    echo "  ./deploy.sh build    - 构建Docker镜像"
    echo "  ./deploy.sh cleanup  - 清理Docker资源"
    echo "  ./deploy.sh help     - 显示帮助信息"
    echo ""
    echo "Render部署步骤:"
    echo "1. 推送代码到GitHub仓库"
    echo "2. 在Render中连接GitHub仓库"
    echo "3. 使用render.yaml配置文件自动部署"
    echo "4. 在Render界面设置环境变量"
}

# 函数：检查服务状态
check_status() {
    echo "📊 检查服务状态..."
    
    # 检查容器状态
    docker-compose ps
    
    # 检查后端健康状态
    echo ""
    echo "后端健康检查:"
    curl -f http://localhost:8080/actuator/health || echo "后端服务未启动"
    
    # 检查前端状态
    echo ""
    echo "前端健康检查:"
    curl -f http://localhost:3000/health || echo "前端服务未启动"
}

# 主要逻辑
case "$1" in
    "local")
        local_deploy
        ;;
    "build")
        build_images
        ;;
    "cleanup")
        cleanup
        ;;
    "status")
        check_status
        ;;
    "help"|*)
        show_help
        ;;
esac 