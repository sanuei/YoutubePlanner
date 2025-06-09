数据库密码：OtvO9P8X36b3up5x

数据库连接：postgresql://postgres:[OtvO9P8X36b3up5x]@db.nvcagxykymgtmprggwhy.supabase.co:5432/postgres


## **PostgreSQL 数据库结构**

### **1. Users 表 (用户表)**

**SQL**

`CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- 存储哈希后的密码
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`

---

### **2. Channels 表 (频道表)**

**SQL**

`CREATE TABLE Channels (
    channel_id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL, -- 创建/拥有此频道的用户
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_channel_name UNIQUE (user_id, channel_name), -- 频道名称对每个用户唯一
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);`

---

### **3. Categories 表 (分类表)**

**SQL**

`CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL, -- 创建/拥有此分类的用户
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_category_name UNIQUE (user_id, category_name), -- 分类名称对每个用户唯一
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);`

---

### **4. Scripts 表 (影片脚本表)**

**SQL**

`CREATE TABLE Scripts (
    script_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                 -- 标题
    alternative_title1 VARCHAR(255),             -- 备用标题名1
    description TEXT,                            -- 描述
    content_chapter1 TEXT,                       -- 正文 章节1
    content_chapter2 TEXT,                       -- 正文 章节2
    content_chapter3 TEXT,                       -- 正文 章节3
    conclusion TEXT,                             -- 结尾
    difficulty INTEGER,                          -- 整段 (星级评分 1-5)
    status VARCHAR(50),                          -- 进度 (例如 'Scripting')
    release_date DATE,                           -- 发布日期
    user_id INTEGER NOT NULL,                    -- 创建/拥有此脚本的用户的外键
    channel_id INTEGER,                          -- 此脚本所属频道的外键
    category_id INTEGER,                         -- 此脚本所属分类的外键
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- 自动更新请参见下面的触发器
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES Channels(channel_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL ON UPDATE CASCADE
);`

---

### **用于 `Scripts` 表中 `updated_at` 的触发器**

**SQL**

- `- 1. 创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = CURRENT_TIMESTAMP; -- 或 NOW() RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 2. 在 Scripts 表上创建触发器
CREATE TRIGGER trigger_scripts_update_updated_at
BEFORE UPDATE ON Scripts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();`

**解释：**

1. 定义了 `update_updated_at_column` 函数，用于将 `NEW` 行（更新后的行）的 `updated_at` 字段设置为当前时间戳。
2. 然后，`CREATE TRIGGER` 语句将此函数附加到 `Scripts` 表，指定它应在 `EACH ROW`（每一行）的 `BEFORE UPDATE`（更新前）操作时触发。