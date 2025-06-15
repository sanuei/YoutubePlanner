#!/bin/bash

# 备份脚本
# 备份应用数据和配置

set -e

BACKUP_DIR="/home/ec2-user/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="youtubeplanner_backup_${DATE}"

echo "开始备份应用数据..."

# 创建备份目录
mkdir -p ${BACKUP_DIR}

cd /home/ec2-user/youtubeplanner

# 创建备份文件夹
mkdir -p ${BACKUP_DIR}/${BACKUP_NAME}

# 备份配置文件
echo "备份配置文件..."
cp docker-compose.prod.yml ${BACKUP_DIR}/${BACKUP_NAME}/
cp .env ${BACKUP_DIR}/${BACKUP_NAME}/

# 备份日志文件
echo "备份日志文件..."
if [ -d "logs" ]; then
    cp -r logs ${BACKUP_DIR}/${BACKUP_NAME}/
fi

# 备份Docker卷数据
echo "备份Docker卷数据..."
docker run --rm -v youtubeplanner_backend_logs:/data -v ${BACKUP_DIR}/${BACKUP_NAME}:/backup alpine tar czf /backup/backend_logs.tar.gz -C /data .

# 导出Docker镜像
echo "导出Docker镜像..."
docker save youtubeplanner-backend:latest | gzip > ${BACKUP_DIR}/${BACKUP_NAME}/backend_image.tar.gz
docker save youtubeplanner-frontend:latest | gzip > ${BACKUP_DIR}/${BACKUP_NAME}/frontend_image.tar.gz

# 创建备份信息文件
cat > ${BACKUP_DIR}/${BACKUP_NAME}/backup_info.txt << EOF
备份时间: $(date)
备份内容:
- 配置文件 (docker-compose.prod.yml, .env)
- 应用日志
- Docker卷数据
- Docker镜像

恢复说明:
1. 解压镜像: docker load < backend_image.tar.gz && docker load < frontend_image.tar.gz
2. 恢复配置: 复制配置文件到应用目录
3. 恢复数据: tar xzf backend_logs.tar.gz -C /path/to/volume
4. 启动服务: docker-compose -f docker-compose.prod.yml up -d
EOF

# 压缩备份
echo "压缩备份文件..."
cd ${BACKUP_DIR}
tar czf ${BACKUP_NAME}.tar.gz ${BACKUP_NAME}
rm -rf ${BACKUP_NAME}

# 清理旧备份 (保留最近7天)
echo "清理旧备份..."
find ${BACKUP_DIR} -name "youtubeplanner_backup_*.tar.gz" -mtime +7 -delete

echo "✅ 备份完成: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo "备份大小: $(du -h ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz | cut -f1)" 