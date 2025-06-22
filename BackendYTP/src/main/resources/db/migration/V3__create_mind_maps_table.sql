-- 创建思维导图表
CREATE TABLE mind_maps (
    mind_map_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    nodes_data TEXT,
    edges_data TEXT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 创建索引
CREATE INDEX idx_mind_maps_user_id ON mind_maps(user_id);
CREATE INDEX idx_mind_maps_user_id_deleted ON mind_maps(user_id, is_deleted);
CREATE INDEX idx_mind_maps_title ON mind_maps(title);
CREATE INDEX idx_mind_maps_created_at ON mind_maps(created_at);
CREATE INDEX idx_mind_maps_updated_at ON mind_maps(updated_at);

-- 添加外键约束（如果需要）
-- ALTER TABLE mind_maps ADD CONSTRAINT fk_mind_maps_user_id FOREIGN KEY (user_id) REFERENCES users(user_id); 