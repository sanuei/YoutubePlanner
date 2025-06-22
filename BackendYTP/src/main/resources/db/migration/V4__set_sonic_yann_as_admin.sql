-- 将 sonic_yann 用户设置为管理员
UPDATE users 
SET role = 'ADMIN' 
WHERE username = 'sonic_yann';

-- 如果 sonic_yann 用户不存在，创建一个（使用密码 Sonic666.）
INSERT INTO users (username, password_hash, email, display_name, role) 
SELECT 'sonic_yann', '$2a$10$OqOQhWAfcdrm0jCZWU2jB.cnZ0oyEVF73QpchJa3V8fYF5fIPX3ea', 'sonic_yann@youtubeplanner.com', 'Sonic Yann', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'sonic_yann');

-- 如果 sonic_yann 用户已存在，更新密码为 Sonic666.
UPDATE users 
SET password_hash = '$2a$10$OqOQhWAfcdrm0jCZWU2jB.cnZ0oyEVF73QpchJa3V8fYF5fIPX3ea'
WHERE username = 'sonic_yann'; 