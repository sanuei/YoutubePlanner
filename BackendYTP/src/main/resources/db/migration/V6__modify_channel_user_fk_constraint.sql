-- 先删除现有的外键约束
ALTER TABLE channels DROP CONSTRAINT IF EXISTS channels_user_id_fkey;

-- 添加新的外键约束，只在 deleted = false 时检查
ALTER TABLE channels
ADD CONSTRAINT channels_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE CASCADE; 