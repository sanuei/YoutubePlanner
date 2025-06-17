#!/bin/bash

echo "🔍 YouTube Planner 部署前检查"
echo "=================================="

# 检查配置文件
echo "📋 检查配置文件..."

# 检查docker-compose.prod.yml
if [ -f "docker-compose.prod.yml" ]; then
    echo "✅ docker-compose.prod.yml 存在"
    
    # 检查域名配置
    if grep -q "youtubeplanner.duckdns.org" docker-compose.prod.yml; then
        echo "✅ 域名配置正确"
    else
        echo "❌ 域名配置缺失"
        exit 1
    fi
    
    # 检查JWT密钥
    if grep -q "JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970" docker-compose.prod.yml; then
        echo "✅ JWT密钥配置正确"
    else
        echo "❌ JWT密钥配置缺失"
        exit 1
    fi
else
    echo "❌ docker-compose.prod.yml 不存在"
    exit 1
fi

# 检查前端Dockerfile
if [ -f "frontendytp/Dockerfile" ]; then
    echo "✅ 前端Dockerfile存在"
    
    if grep -q "REACT_APP_API_BASE_URL" frontendytp/Dockerfile; then
        echo "✅ 前端环境变量配置正确"
    else
        echo "❌ 前端环境变量配置缺失"
        exit 1
    fi
else
    echo "❌ 前端Dockerfile不存在"
    exit 1
fi

# 检查GitHub Actions配置
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ GitHub Actions配置存在"
    
    if grep -q "REACT_APP_API_BASE_URL=https://youtubeplanner.duckdns.org/api/v1" .github/workflows/deploy.yml; then
        echo "✅ GitHub Actions环境变量配置正确"
    else
        echo "❌ GitHub Actions环境变量配置缺失"
        exit 1
    fi
else
    echo "❌ GitHub Actions配置不存在"
    exit 1
fi

# 检查敏感信息配置
if [ -f "docs/敏感信息配置.md" ]; then
    echo "✅ 敏感信息配置文档存在"
    
    if grep -q "43.206.130.75" "docs/敏感信息配置.md"; then
        echo "✅ EC2 IP地址已更新"
    else
        echo "❌ EC2 IP地址未更新"
        exit 1
    fi
else
    echo "❌ 敏感信息配置文档不存在"
    exit 1
fi

echo ""
echo "🎉 所有检查通过！"
echo "=================================="
echo "📝 部署清单："
echo "1. ✅ Docker配置正确"
echo "2. ✅ 域名配置正确"
echo "3. ✅ 环境变量配置正确"
echo "4. ✅ GitHub Actions配置正确"
echo "5. ✅ EC2 IP地址已更新"
echo ""
echo "🚀 准备提交代码并触发部署..."
echo ""
echo "⚠️  重要提醒："
echo "- 确保GitHub Secrets中的EC2_HOST已更新为: 43.206.130.75"
echo "- 确保EC2实例正在运行"
echo "- 确保安全组允许22端口(SSH)、80端口(HTTP)、443端口(HTTPS)" 