/*
 * 创建日期: 2024-03-21
 * 文件说明: 影片脚本创建页面组件，提供脚本的创建功能
 * 作者: Yann
 * 模块: components
 * 版本: 1.0
 * 修改记录:
 * - 2024-03-21 Yann 创建初始版本
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { scriptsApi, Chapter, categoriesApi, Category } from '../services/api';

// 添加字数统计函数
const calculateWordCount = (chapters: Chapter[]): number => {
  let count = 0;
  if (chapters) {
    chapters.forEach(chapter => {
      if (chapter.content) {
        // 移除HTML标签和特殊字符，只保留中英文
        const text = chapter.content.replace(/<[^>]+>/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
        count += text.length;
      }
    });
  }
  return count;
};

const ScriptCreate: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    alternative_title1: '',
    description: '',
    category_id: undefined as number | undefined,
    chapters: [{ chapter_number: 1, title: '', content: '' }] as Chapter[],
  });

  // 添加字数统计状态
  const [wordCount, setWordCount] = useState(0);

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getList({
          limit: 100,
          sort_by: 'category_name',
          order: 'asc'
        });
        if (response.success) {
          setCategories(response.data.items);
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        enqueueSnackbar('获取分类列表失败', { variant: 'error' });
      }
    };
    fetchCategories();
  }, [enqueueSnackbar]);

  // 更新字数统计
  useEffect(() => {
    setWordCount(calculateWordCount(formData.chapters));
  }, [formData.chapters]);

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        category_id: formData.category_id || undefined,
      };
      console.log('Submitting script data:', submitData);
      const response = await scriptsApi.create(submitData);
      if (response.success) {
        enqueueSnackbar('脚本创建成功', { variant: 'success' });
        navigate('/scripts');
      } else {
        enqueueSnackbar(response.message || '创建脚本失败', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Error creating script:', error);
      enqueueSnackbar(error.message || '创建脚本失败', { variant: 'error' });
    }
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          chapter_number: prev.chapters.length + 1,
          title: '',
          content: '',
        },
      ],
    }));
  };

  const removeChapter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index).map((chapter, i) => ({
        ...chapter,
        chapter_number: i + 1,
      })),
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate('/scripts')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          创建新脚本
        </Typography>
      </Stack>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="标题"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="备选标题"
              value={formData.alternative_title1}
              onChange={(e) => setFormData(prev => ({ ...prev, alternative_title1: e.target.value }))}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="描述"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>分类</InputLabel>
              <Select
                value={formData.category_id || ''}
                label="分类"
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: Number(e.target.value) }))}
              >
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">章节</Typography>
              <Button
                startIcon={<AddCircleIcon />}
                onClick={addChapter}
                variant="outlined"
              >
                添加章节
              </Button>
            </Box>
            {formData.chapters.map((chapter, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">第 {chapter.chapter_number} 章</Typography>
                  {formData.chapters.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => removeChapter(index)}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  )}
                </Box>
                <TextField
                  fullWidth
                  label="章节标题"
                  value={chapter.title}
                  onChange={(e) => {
                    const newChapters = [...formData.chapters];
                    newChapters[index].title = e.target.value;
                    setFormData(prev => ({ ...prev, chapters: newChapters }));
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={8}
                  label="章节内容"
                  value={chapter.content}
                  onChange={(e) => {
                    const newChapters = [...formData.chapters];
                    newChapters[index].content = e.target.value;
                    setFormData(prev => ({ ...prev, chapters: newChapters }));
                  }}
                />
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="body2" color="text.secondary">
                总字数：{wordCount}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/scripts')}
                >
                  取消
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!formData.title || formData.chapters.some(chapter => !chapter.content)}
                >
                  创建脚本
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ScriptCreate; 