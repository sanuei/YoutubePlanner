-- YouTube Planner 数据库初始化脚本

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    avatar_url VARCHAR(500),
    display_name VARCHAR(255),
    role VARCHAR(50) CHECK (role::text = ANY (ARRAY['USER'::character varying, 'ADMIN'::character varying]::text[])),
    -- API配置相关字段 (V2迁移)
    api_provider VARCHAR(20),
    api_key VARCHAR(500),
    api_base_url VARCHAR(500),
    api_model VARCHAR(100)
);

-- 添加用户表字段注释
COMMENT ON COLUMN users.role IS '用户角色，不能为空，默认为USER';
COMMENT ON COLUMN users.api_provider IS 'API提供商: openai, claude, custom';
COMMENT ON COLUMN users.api_key IS 'API密钥';
COMMENT ON COLUMN users.api_base_url IS 'API基础URL';
COMMENT ON COLUMN users.api_model IS 'API模型名称';

-- 创建频道表
CREATE TABLE IF NOT EXISTS channels (
    channel_id BIGSERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
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

-- 创建脚本表
CREATE TABLE IF NOT EXISTS scripts (
    script_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    alternative_title1 VARCHAR(255),
    description TEXT,
    user_id BIGINT NOT NULL,
    channel_id BIGINT,
    category_id BIGINT,
    status VARCHAR(50),
    difficulty INTEGER,
    release_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_script_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_script_channel FOREIGN KEY (channel_id) REFERENCES channels(channel_id),
    CONSTRAINT fk_script_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 创建脚本章节表
CREATE TABLE IF NOT EXISTS script_chapters (
    chapter_id BIGSERIAL PRIMARY KEY,
    script_id BIGINT NOT NULL,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT script_chapters_video_script_id_fkey FOREIGN KEY (script_id) REFERENCES scripts(script_id)
);

-- 创建思维导图表 (V3迁移)
CREATE TABLE IF NOT EXISTS mind_maps (
    mind_map_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    nodes_data TEXT,
    edges_data TEXT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_mind_maps_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_channels_user_id ON channels(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_deleted ON channels(deleted);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_channel_id ON scripts(channel_id);
CREATE INDEX IF NOT EXISTS idx_scripts_category_id ON scripts(category_id);
CREATE INDEX IF NOT EXISTS idx_script_chapters_script_id ON script_chapters(script_id);

-- 思维导图表索引
CREATE INDEX IF NOT EXISTS idx_mind_maps_user_id ON mind_maps(user_id);
CREATE INDEX IF NOT EXISTS idx_mind_maps_user_id_deleted ON mind_maps(user_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_mind_maps_title ON mind_maps(title);
CREATE INDEX IF NOT EXISTS idx_mind_maps_created_at ON mind_maps(created_at);
CREATE INDEX IF NOT EXISTS idx_mind_maps_updated_at ON mind_maps(updated_at);

-- 插入默认管理员用户
-- 密码是 'admin123' 的BCrypt哈希值
INSERT INTO users (username, password_hash, email, display_name, role) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbdxIcnvtcflQjXaC', 'admin@youtubeplanner.com', 'Administrator', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 插入sonic_yann管理员用户 (V4迁移内容)
-- 密码是 'Sonic666.' 的BCrypt哈希值
INSERT INTO users (username, password_hash, email, display_name, role) 
VALUES ('sonic_yann', '$2a$10$OqOQhWAfcdrm0jCZWU2jB.cnZ0oyEVF73QpchJa3V8fYF5fIPX3ea', 'sonic_yann@youtubeplanner.com', 'Sonic Yann', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 为管理员创建默认频道
INSERT INTO channels (channel_name, user_id) 
SELECT '默认频道', user_id FROM users WHERE username = 'admin'
ON CONFLICT (user_id, channel_name) DO NOTHING;

INSERT INTO channels (channel_name, user_id) 
SELECT '默认频道', user_id FROM users WHERE username = 'sonic_yann'
ON CONFLICT (user_id, channel_name) DO NOTHING;

-- 为管理员创建默认分类
INSERT INTO categories (category_name, user_id) 
SELECT '默认分类', user_id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO categories (category_name, user_id) 
SELECT '默认分类', user_id FROM users WHERE username = 'sonic_yann'
ON CONFLICT DO NOTHING; 