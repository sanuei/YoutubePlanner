-- YouTube Planner 数据库初始化脚本

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar_url VARCHAR(500),
    display_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'USER'
);

-- 创建频道表
CREATE TABLE IF NOT EXISTS channels (
    channel_id BIGSERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_channel_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT uq_user_channel_name UNIQUE (user_id, channel_name)
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建视频脚本表
CREATE TABLE IF NOT EXISTS video_scripts (
    script_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id BIGINT NOT NULL,
    channel_id BIGINT,
    category_id BIGINT,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_script_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_script_channel FOREIGN KEY (channel_id) REFERENCES channels(channel_id),
    CONSTRAINT fk_script_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_channels_user_id ON channels(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_deleted ON channels(deleted);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_video_scripts_user_id ON video_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_video_scripts_channel_id ON video_scripts(channel_id);
CREATE INDEX IF NOT EXISTS idx_video_scripts_category_id ON video_scripts(category_id);

-- 插入默认管理员用户（可选）
-- 密码是 'admin123' 的BCrypt哈希值
INSERT INTO users (username, password_hash, email, display_name, role) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbdxIcnvtcflQjXaC', 'admin@youtubeplanner.com', 'Administrator', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 为管理员创建默认频道
INSERT INTO channels (channel_name, user_id) 
SELECT '默认频道', user_id FROM users WHERE username = 'admin'
ON CONFLICT (user_id, channel_name) DO NOTHING;

-- 为管理员创建默认分类
INSERT INTO categories (category_name, user_id) 
SELECT '默认分类', user_id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING; 