import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Stack,
  Paper,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { categoriesApi, scriptsApi, Category, Script } from '../services/api';
import { format } from 'date-fns';

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  cursor: 'pointer',
}));

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getList({
        search,
        limit: 100,
      });
      
      if (response.success) {
        setCategories(response.data.items);
      } else {
        enqueueSnackbar(response.message || '获取分类列表失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '获取分类列表失败', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [search, enqueueSnackbar]);

  const fetchScripts = useCallback(async () => {
    try {
      const response = await scriptsApi.getList({
        limit: 100,
      });
      
      if (response.success) {
        setScripts(response.data.items);
      }
    } catch (error: any) {
      console.error('获取脚本列表失败:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchScripts();
  }, [fetchCategories, fetchScripts]);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      enqueueSnackbar('请输入分类名称', { variant: 'warning' });
      return;
    }
    
    try {
      const response = await categoriesApi.create({ 
        category_name: categoryName,
        user_id: 1  // 使用当前登录用户的ID
      });
      if (response.success) {
        enqueueSnackbar('创建分类成功', { variant: 'success' });
        setOpenDialog(false);
        setCategoryName('');
        fetchCategories();
      } else {
        enqueueSnackbar(response.message || '创建分类失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '创建分类失败', { variant: 'error' });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategory || !categoryName.trim()) {
      enqueueSnackbar('请输入分类名称', { variant: 'warning' });
      return;
    }
    
    try {
      const response = await categoriesApi.update(editCategory.category_id, { 
        category_name: categoryName,
        user_id: 1  // 使用当前登录用户的ID
      });
      if (response.success) {
        enqueueSnackbar('更新分类成功', { variant: 'success' });
        setOpenDialog(false);
        setEditCategory(null);
        setCategoryName('');
        fetchCategories();
      } else {
        enqueueSnackbar(response.message || '更新分类失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '更新分类失败', { variant: 'error' });
    }
  };

  const handleDeleteCategories = async () => {
    if (!window.confirm('确定要删除选中的分类吗？')) return;
    
    try {
      await Promise.all(selectedCategories.map(id => categoriesApi.delete(id)));
      enqueueSnackbar('删除分类成功', { variant: 'success' });
      setSelectedCategories([]);
      fetchCategories();
    } catch (error: any) {
      enqueueSnackbar(error.message || '删除分类失败', { variant: 'error' });
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditCategory(category);
      setCategoryName(category.category_name);
    } else {
      setEditCategory(null);
      setCategoryName('');
    }
    setOpenDialog(true);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="500">
          分类管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: 'none' }}
        >
          创建分类
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="搜索分类..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          {selectedCategories.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteCategories}
              sx={{ textTransform: 'none' }}
            >
              删除选中 ({selectedCategories.length})
            </Button>
          )}
        </Stack>
      </Paper>

      {categories.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'background.paper',
          borderRadius: 1
        }}>
          <Typography color="text.secondary">
            暂无分类数据
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
        }}>
          {categories.map((category) => {
            const categoryScripts = scripts.filter(script => script.category_id === category.category_id);
            return (
              <StyledCard 
                key={category.category_id} 
                elevation={1}
                onClick={() => handleOpenDialog(category)}
              >
                <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Checkbox
                      checked={selectedCategories.includes(category.category_id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category.category_id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {category.category_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        创建时间：{format(new Date(category.created_at), 'yyyy-MM-dd')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        脚本数量：{categoryScripts.length}
                      </Typography>
                      {categoryScripts.length > 0 && (
                        <List dense sx={{ mt: 2 }}>
                          {categoryScripts.map((script) => (
                            <ListItem key={script.script_id} disablePadding>
                              <ListItemText
                                primary={script.title}
                                secondary={
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                      label={script.status || '未设置'}
                                      size="small"
                                      color="secondary"
                                      variant="outlined"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {format(new Date(script.updated_at), 'yyyy-MM-dd')}
                                    </Typography>
                                  </Stack>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            );
          })}
        </Box>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editCategory ? '编辑分类' : '创建分类'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="分类名称"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            取消
          </Button>
          <Button
            onClick={editCategory ? handleUpdateCategory : handleCreateCategory}
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            {editCategory ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CategoryManagement; 