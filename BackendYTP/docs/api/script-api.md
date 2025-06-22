# 脚本管理 API 文档

## 获取脚本列表

获取当前用户的脚本列表，支持多种过滤条件和分页。

### 请求

```http
GET /api/v1/scripts
```

### 查询参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | integer | 否 | 页码，从 1 开始，默认值：1 |
| limit | integer | 否 | 每页记录数，默认值：10 |
| search | string | 否 | 搜索关键词，会匹配标题和描述 |
| sort_by | string | 否 | 排序字段，可选值：created_at, updated_at, title, difficulty, release_date |
| order | string | 否 | 排序方向，可选值：asc, desc |
| channel_id | integer | 否 | 按频道 ID 过滤 |
| category_id | integer | 否 | 按分类 ID 过滤 |
| status | string | 否 | 按状态过滤，可选值：draft, scripting, reviewing, published, completed |
| difficulty | integer | 否 | 按难度过滤，范围：1-5 |
| date_from | string | 否 | 发布日期范围开始，格式：YYYY-MM-DD |
| date_to | string | 否 | 发布日期范围结束，格式：YYYY-MM-DD |
| include | string | 否 | 包含的关联数据，多个值用逗号分隔，可选值：category, channel |

### 响应

```json
{
    "success": true,
    "code": 200,
    "message": "操作成功",
    "data": {
        "items": [
            {
                "script_id": 26,
                "title": "第一篇脚本2",
                "description": "",
                "status": "Scripting",
                "difficulty": 3,
                "channel": {
                    "channel_id": 20,
                    "channel_name": "Everyday Japanese"
                },
                "category": {
                    "category_id": 2,
                    "category_name": "Personal"
                },
                "release_date": null,
                "chapters_count": 1,
                "created_at": "2025-06-12T12:49:35.453023Z",
                "updated_at": "2025-06-12T13:46:25.977759Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 18,
            "pages": 2,
            "has_next": true,
            "has_prev": false
        }
    },
    "timestamp": "2025-06-12T13:51:55.457321Z",
    "request_id": "b4b87d81-8768-47e1-ba7d-3292642669ab"
}
```

### 响应字段说明

#### data.items[] 字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| script_id | integer | 脚本 ID |
| title | string | 脚本标题 |
| description | string | 脚本描述 |
| status | string | 脚本状态 |
| difficulty | integer | 难度等级（1-5） |
| channel | object | 关联的频道信息 |
| channel.channel_id | integer | 频道 ID |
| channel.channel_name | string | 频道名称 |
| category | object | 关联的分类信息 |
| category.category_id | integer | 分类 ID |
| category.category_name | string | 分类名称 |
| release_date | string | 发布日期 |
| chapters_count | integer | 章节数量 |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

#### data.pagination 字段

| 字段名 | 类型 | 描述 |
|--------|------|------|
| page | integer | 当前页码 |
| limit | integer | 每页记录数 |
| total | integer | 总记录数 |
| pages | integer | 总页数 |
| has_next | boolean | 是否有下一页 |
| has_prev | boolean | 是否有上一页 |

### 示例

1. 获取所有脚本（分页）：
```http
GET /api/v1/scripts?page=1&limit=10
```

2. 按频道和分类过滤：
```http
GET /api/v1/scripts?channel_id=20&category_id=2
```

3. 按状态和难度过滤：
```http
GET /api/v1/scripts?status=Scripting&difficulty=3
```

4. 搜索并包含关联数据：
```http
GET /api/v1/scripts?search=日语&include=category,channel
```

5. 按日期范围过滤：
```http
GET /api/v1/scripts?date_from=2024-01-01&date_to=2024-12-31
```

### 注意事项

1. 所有时间字段使用 ISO 8601 格式
2. 分页参数 page 从 1 开始计数
3. 当指定 channel_id 时，只会返回属于该频道的脚本
4. 当指定 category_id 时，只会返回属于该分类的脚本
5. 搜索关键词会同时匹配标题和描述字段
6. 排序默认按创建时间降序（最新优先） 