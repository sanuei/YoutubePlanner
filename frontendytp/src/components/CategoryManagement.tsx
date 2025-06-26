import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  InputAdornment,
  Stack,
  Skeleton,
  IconButton,
  Fab,
  Avatar,
  alpha,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Collapse,
  Checkbox,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandLess as ExpandLessIcon,
  Sort as SortIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { categoriesApi, scriptsApi, Category, Script } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CategoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [categories, setCategories] = useState<Category[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  // 分页状态
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  // 筛选状态
  const [filters, setFilters] = useState({
    search: '',
  });

  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // 搜索防抖
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getList({
        search: debouncedSearch,
        sort_by: sortBy,
        order,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      if (response.success) {
        setCategories(response.data.items);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total || 0,
            pages: Math.ceil((response.data.pagination.total || 0) / pagination.limit),
          }));
        }
      } else {
        enqueueSnackbar(response.message || '获取分类列表失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '获取分类列表失败', { variant: 'error' });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [debouncedSearch, sortBy, order, pagination.page, pagination.limit, enqueueSnackbar]);

  const fetchScripts = useCallback(async () => {
    try {
      const response = await scriptsApi.getList({
        limit: 1000,
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      return newFilters;
    });
    setPagination(prev => ({ ...prev, page: 1 })); // 重置页码
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      enqueueSnackbar('请输入分类名称', { variant: 'warning' });
      return;
    }
    
    try {
      const response = await categoriesApi.create({ 
        category_name: categoryName,
        user_id: user?.id
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
        user_id: user?.id
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

  const handleBatchDelete = async () => {
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

  const handleScriptClick = (scriptId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/scripts/${scriptId}/preview`);
  };

  // 分类卡片组件
  const CategoryCard = ({ category }: { category: Category }) => {
    const categoryScripts = scripts.filter(script => 
      script.category?.category_id === category.category_id
    );
    const isSelected = selectedCategories.includes(category.category_id);

    return (
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
          borderRadius: 1.5,
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.grey[500], 0.15)}`,
            borderColor: alpha(theme.palette.grey[400], 0.6)
          },
          ...(isSelected && {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
          })
        }}
        onClick={() => handleOpenDialog(category)}
      >
        <CardContent sx={{ p: 3 }}>
          {/* 头部：复选框和编辑按钮 */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Checkbox
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                handleCategorySelect(category.category_id);
              }}
              onClick={(e) => e.stopPropagation()}
              size="small"
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDialog(category);
              }}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <EditIcon />
            </IconButton>
          </Stack>

          {/* 分类图标和名称 */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2
              }}
            >
              <CategoryIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography 
              variant="h6" 
              component="h3"
              fontWeight={600}
              color="text.primary"
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 1
              }}
            >
              {category.category_name}
            </Typography>
            <Chip 
              label={`${categoryScripts.length} 个脚本`}
              size="small" 
              variant="outlined"
              color="primary"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>

          {/* 相关脚本列表 */}
          {categoryScripts.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                相关脚本：
              </Typography>
              <Stack spacing={1}>
                {categoryScripts.slice(0, 3).map((script) => (
                  <Paper
                    key={script.script_id}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: alpha(theme.palette.grey[50], 0.5),
                      border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderColor: alpha(theme.palette.primary.main, 0.2)
                      }
                    }}
                    onClick={(e) => handleScriptClick(script.script_id, e)}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <DescriptionIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography 
                        variant="body2" 
                        color="text.primary"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}
                      >
                        {script.title}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
                {categoryScripts.length > 3 && (
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                    还有 {categoryScripts.length - 3} 个脚本...
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {categoryScripts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                暂无相关脚本
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (initialLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={56} sx={{ mt: 2, mb: 3 }} />
        <Grid container spacing={3}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 页面头部 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="500">
          分类管理
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={showFilters ? <ExpandLessIcon /> : <FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              筛选
            </Button>
          )}
          {selectedCategories.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              size={isMobile ? 'small' : 'medium'}
            >
              删除 ({selectedCategories.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ 
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            {isMobile ? '创建' : '创建分类'}
          </Button>
        </Box>
      </Box>

      {/* 筛选和搜索区域 */}
      <Collapse in={!isMobile || showFilters}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="搜索分类..."
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControl size="small">
                  <InputLabel>排序</InputLabel>
                  <Select
                    value={sortBy}
                    label="排序"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="created_at">创建时间</MenuItem>
                    <MenuItem value="updated_at">最后修改</MenuItem>
                    <MenuItem value="category_name">分类名称</MenuItem>
                  </Select>
                </FormControl>
                <IconButton onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
                  <SortIcon sx={{ transform: order === 'desc' ? 'rotate(180deg)' : '' }} />
                </IconButton>
              </Stack>
            </Grid>
            {selectedCategories.length > 0 && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    已选择 {selectedCategories.length} 项
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleBatchDelete}
                  >
                    删除
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Collapse>

      {/* 分类列表 */}
      {categories.length === 0 && !loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            暂无分类数据
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            您还没有创建任何分类，点击下方按钮开始创建
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            创建第一个分类
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid key={category.category_id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CategoryCard category={category} />
            </Grid>
          ))}
        </Grid>
      )}

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

      {/* 移动端浮动创建按钮 */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      )}

      {/* 创建/编辑对话框 */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          elevation: 0,
          sx: { 
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            m: 2
          } 
        }}
      >
        <DialogTitle sx={{ pb: 2, pt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" fontWeight={600}>
                {editCategory ? '编辑分类' : '创建分类'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {editCategory ? '修改分类信息' : '创建新的内容分类'}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="分类名称"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="请输入分类名称"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: alpha(theme.palette.grey[300], 0.8),
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                }
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            color="inherit"
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            取消
          </Button>
          <Button 
            onClick={editCategory ? handleUpdateCategory : handleCreateCategory} 
            variant="contained"
            sx={{ 
              minWidth: 80,
              boxShadow: 'none',
              '&:hover': { boxShadow: 1 }
            }}
          >
            {editCategory ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement; 