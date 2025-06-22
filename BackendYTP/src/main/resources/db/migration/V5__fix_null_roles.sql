-- 修复role为null的用户，设置默认角色为USER
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- 确保role字段不能为null
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- 添加注释
COMMENT ON COLUMN users.role IS '用户角色，不能为空，默认为USER'; 