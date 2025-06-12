/*
 * 创建日期: 2024-03-21
 * 文件说明: 影片脚本管理组件，提供脚本的列表展示、编辑和删除功能
 * 作者: Yann
 * 模块: components
 * 版本: 1.0
 * 修改记录:
 * - 2024-03-21 Yann 创建初始版本
 * - 2024-03-21 Yann 更新API接口，添加筛选和排序功能
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { scriptsApi, channelsApi, categoriesApi, Script, Channel, Category } from '../services/api';
import { format } from 'date-fns';

const ScriptManagement: React.FC = () => {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [editFormData, setEditFormData] = useState({
    difficulty: 3,
    status: 'Scripting',
    release_date: '',
    channel_id: '',
    category_id: '',
  });

  // 分页和筛选状态
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState({
    search: '',
    channel_id: '',
    category_id: '',
    status: '',
    difficulty: '',
    date_from: '',
    date_to: '',
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { enqueueSnackbar } = useSnackbar();

  const fetchScripts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await scriptsApi.getList({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sort_by: sortBy,
        order,
      });
      
      if (response.success) {
        setScripts(response.data.items);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        }));
      } else {
        enqueueSnackbar(response.message || '获取脚本列表失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '获取脚本列表失败', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sortBy, order, enqueueSnackbar]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  const fetchChannels = async () => {
    try {
      const response = await channelsApi.getList({});
      if (response.success) {
        setChannels(response.data.items);
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '获取频道列表失败', { variant: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getList({});
      if (response.success) {
        setCategories(response.data.items);
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '获取分类列表失败', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchCategories();
  }, []);

  const handleEdit = (script: Script) => {
    setEditingScript(script);
    setEditFormData({
      difficulty: script.difficulty || 3,
      status: script.status || 'Scripting',
      release_date: script.release_date || '',
      channel_id: script.channel_id?.toString() || '',
      category_id: script.category_id?.toString() || '',
    });
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!editingScript) return;

    try {
      const payload = {
        ...editFormData,
        channel_id: editFormData.channel_id ? parseInt(editFormData.channel_id) : undefined,
        category_id: editFormData.category_id ? parseInt(editFormData.category_id) : undefined,
      };

      const response = await scriptsApi.update(editingScript.script_id, payload);
      if (response.success) {
        enqueueSnackbar('脚本更新成功', { variant: 'success' });
        setOpenEditDialog(false);
        fetchScripts();
      } else {
        enqueueSnackbar(response.message || '更新脚本失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '更新脚本失败', { variant: 'error' });
    }
  };

  const handleDelete = async (scriptId: number) => {
    if (!window.confirm('确定要删除这个脚本吗？')) return;

    try {
      const response = await scriptsApi.delete(scriptId);
      if (response.success) {
        enqueueSnackbar('脚本删除成功', { variant: 'success' });
        fetchScripts();
      } else {
        enqueueSnackbar(response.message || '删除脚本失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '删除脚本失败', { variant: 'error' });
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // 重置页码
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="500">
          影片脚本管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/scripts/create')}
        >
          创建脚本
        </Button>
      </Box>

      {/* 筛选和搜索区域 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索脚本..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>频道</InputLabel>
              <Select
                value={filters.channel_id}
                label="频道"
                onChange={(e) => handleFilterChange('channel_id', e.target.value)}
              >
                <MenuItem value="">全部</MenuItem>
                {channels.map((channel) => (
                  <MenuItem key={channel.channel_id} value={channel.channel_id}>
                    {channel.channel_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>分类</InputLabel>
              <Select
                value={filters.category_id}
                label="分类"
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
              >
                <MenuItem value="">全部</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>状态</InputLabel>
              <Select
                value={filters.status}
                label="状态"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="Scripting">编写中</MenuItem>
                <MenuItem value="Reviewing">审核中</MenuItem>
                <MenuItem value="Completed">已完成</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>难度</InputLabel>
              <Select
                value={filters.difficulty}
                label="难度"
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="1">简单</MenuItem>
                <MenuItem value="2">较简单</MenuItem>
                <MenuItem value="3">中等</MenuItem>
                <MenuItem value="4">较难</MenuItem>
                <MenuItem value="5">困难</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="开始日期"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="结束日期"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>排序</InputLabel>
              <Select
                value={sortBy}
                label="排序"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="created_at">创建时间</MenuItem>
                <MenuItem value="updated_at">更新时间</MenuItem>
                <MenuItem value="release_date">发布日期</MenuItem>
                <MenuItem value="title">标题</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <IconButton onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
              <SortIcon sx={{ transform: order === 'desc' ? 'rotate(180deg)' : '' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* 脚本列表 */}
      <Grid container spacing={3}>
        {scripts.map((script) => (
          <Grid item xs={12} md={6} lg={4} key={script.script_id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {script.title}
              </Typography>
              {script.alternative_title1 && (
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  备选标题: {script.alternative_title1}
                </Typography>
              )}
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip
                  label={`难度: ${script.difficulty || '未设置'}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`状态: ${script.status || '未设置'}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                章节数: {script.chapters?.length || 0}
              </Typography>
              {script.release_date && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  发布日期: {format(new Date(script.release_date), 'yyyy-MM-dd')}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(script)}
                >
                  编辑
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(script.script_id)}
                >
                  删除
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 分页 */}
      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* 编辑对话框 */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>编辑脚本</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>难度</InputLabel>
                <Select
                  value={editFormData.difficulty}
                  label="难度"
                  onChange={(e) => setEditFormData(prev => ({ ...prev, difficulty: Number(e.target.value) }))}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={editFormData.status}
                  label="状态"
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="Scripting">编写中</MenuItem>
                  <MenuItem value="Reviewing">审核中</MenuItem>
                  <MenuItem value="Completed">已完成</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="发布日期"
                value={editFormData.release_date}
                onChange={(e) => setEditFormData(prev => ({ ...prev, release_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>频道</InputLabel>
                <Select
                  value={editFormData.channel_id}
                  label="频道"
                  onChange={(e) => setEditFormData(prev => ({ ...prev, channel_id: e.target.value }))}
                >
                  {channels.map((channel) => (
                    <MenuItem key={channel.channel_id} value={channel.channel_id}>
                      {channel.channel_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>分类</InputLabel>
                <Select
                  value={editFormData.category_id}
                  label="分类"
                  onChange={(e) => setEditFormData(prev => ({ ...prev, category_id: e.target.value }))}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEditDialog(false)}>取消</Button>
          <Button variant="contained" onClick={handleUpdate}>
            更新
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScriptManagement; 