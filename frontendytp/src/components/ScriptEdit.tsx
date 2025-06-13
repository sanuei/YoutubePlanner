/*
 * 创建日期: 2024-03-21
 * 文件说明: 影片脚本编辑页面组件，提供脚本的编辑功能
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
  CircularProgress,
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
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { scriptsApi, channelsApi, categoriesApi, Script, Chapter } from '../services/api';
import { format } from 'date-fns';

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

const ScriptEdit: React.FC = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Script>>({
    title: '',
    alternative_title1: '',
    description: '',
    difficulty: 3,
    status: 'Scripting',
    channel_id: undefined,
    category_id: undefined,
    chapters: [],
  });

  // 添加字数统计状态
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!scriptId) {
        setError('脚本ID无效');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // 先获取脚本详情
        const scriptResponse = await scriptsApi.getDetail(Number(scriptId));
        
        if (!scriptResponse.success) {
          throw new Error(scriptResponse.message || '获取脚本详情失败');
        }
        
        // 确保设置默认值
        setFormData({
          ...scriptResponse.data,
          difficulty: scriptResponse.data.difficulty || 3,
          status: scriptResponse.data.status || 'Scripting',
        });
        
        // 分别获取频道和分类数据，即使其中一个失败也不影响整体功能
        try {
          const channelsResponse = await channelsApi.getList({});
          if (channelsResponse.success) {
            setChannels(channelsResponse.data.items);
          }
        } catch (error) {
          console.error('Error fetching channels:', error);
          enqueueSnackbar('获取频道列表失败，但您可以继续编辑脚本', { 
            variant: 'warning',
            autoHideDuration: 5000,
          });
        }

        try {
          const categoriesResponse = await categoriesApi.getList({});
          if (categoriesResponse.success) {
            setCategories(categoriesResponse.data.items);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          enqueueSnackbar('获取分类列表失败，但您可以继续编辑脚本', { 
            variant: 'warning',
            autoHideDuration: 5000,
          });
        }
      } catch (error: any) {
        console.error('Error in ScriptEdit:', error);
        setError(error.message || '获取脚本数据失败');
        enqueueSnackbar(error.message || '获取脚本数据失败', { 
          variant: 'error',
          autoHideDuration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scriptId, navigate, enqueueSnackbar]);

  // 更新字数统计
  useEffect(() => {
    setWordCount(calculateWordCount(formData.chapters || []));
  }, [formData.chapters]);

  const handleSubmit = async () => {
    try {
      // 确保提交的数据包含所有必要字段
      const submitData = {
        ...formData,
        difficulty: formData.difficulty || 3,
        status: formData.status || 'Scripting',
        category_id: formData.category_id || undefined,
      };
      console.log('Submitting script data:', submitData);
      
      const response = await scriptsApi.update(Number(scriptId), submitData);
      if (response.success) {
        enqueueSnackbar('脚本更新成功', { variant: 'success' });
        navigate('/scripts');
      } else {
        enqueueSnackbar(response.message || '更新脚本失败', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Error updating script:', error);
      enqueueSnackbar(error.message || '更新脚本失败', { variant: 'error' });
    }
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [
        ...(prev.chapters || []),
        {
          chapter_number: (prev.chapters?.length || 0) + 1,
          title: '',
          content: '',
        },
      ],
    }));
  };

  const removeChapter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters?.filter((_, i) => i !== index).map((chapter, i) => ({
        ...chapter,
        chapter_number: i + 1,
      })),
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate('/scripts')} size="large">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            编辑脚本
          </Typography>
        </Stack>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/scripts')}
            sx={{ mt: 2 }}
          >
            返回脚本列表
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate('/scripts')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          编辑脚本
        </Typography>
      </Stack>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid component="div" size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label="标题"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid component="div" size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="备选标题"
              value={formData.alternative_title1}
              onChange={(e) => setFormData(prev => ({ ...prev, alternative_title1: e.target.value }))}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid component="div" size={{ xs: 12 }}>
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
          <Grid component="div" size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>难度</InputLabel>
              <Select
                value={formData.difficulty || ''}
                label="难度"
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value ? Number(e.target.value) : undefined }))}
              >
                <MenuItem value="">未设置</MenuItem>
                {[1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>状态</InputLabel>
              <Select
                value={formData.status || ''}
                label="状态"
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value || undefined }))}
              >
                <MenuItem value="">未设置</MenuItem>
                <MenuItem value="Scripting">编写中</MenuItem>
                <MenuItem value="Reviewing">审核中</MenuItem>
                <MenuItem value="Completed">已完成</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>频道</InputLabel>
              <Select
                value={formData.channel_id || ''}
                label="频道"
                onChange={(e) => setFormData(prev => ({ ...prev, channel_id: e.target.value ? Number(e.target.value) : undefined }))}
              >
                <MenuItem value="">未设置</MenuItem>
                {channels.map((channel) => (
                  <MenuItem key={channel.channel_id} value={channel.channel_id}>
                    {channel.channel_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>分类</InputLabel>
              <Select
                value={formData.category_id || ''}
                label="分类"
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : undefined }))}
              >
                <MenuItem value="">未设置</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" size={{ xs: 12 }}>
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
            {formData.chapters?.map((chapter, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">第 {chapter.chapter_number} 章</Typography>
                  {formData.chapters && formData.chapters.length > 1 && (
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
                    const newChapters = [...(formData.chapters || [])];
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
                    const newChapters = [...(formData.chapters || [])];
                    newChapters[index].content = e.target.value;
                    setFormData(prev => ({ ...prev, chapters: newChapters }));
                  }}
                />
              </Box>
            ))}
          </Grid>
          <Grid component="div" size={{ xs: 12 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                总字数：{wordCount}
              </Typography>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ textTransform: 'none' }}
              >
                保存
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ScriptEdit; 