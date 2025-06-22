-- 为用户表添加API配置相关字段
ALTER TABLE users 
ADD COLUMN api_provider VARCHAR(20),
ADD COLUMN api_key VARCHAR(500),
ADD COLUMN api_base_url VARCHAR(500),
ADD COLUMN api_model VARCHAR(100);

-- 添加注释
COMMENT ON COLUMN users.api_provider IS 'API提供商: openai, claude, custom';
COMMENT ON COLUMN users.api_key IS 'API密钥';
COMMENT ON COLUMN users.api_base_url IS 'API基础URL';
COMMENT ON COLUMN users.api_model IS 'API模型名称'; 