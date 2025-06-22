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
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Fab,
  Grid,
  Pagination,
  Checkbox,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  ExpandLess as ExpandLessIcon,
  AccountTree as AccountTreeIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { scriptsApi, categoriesApi, channelsApi, Script, Category, Channel } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ScriptManagement: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scripts, setScripts] = useState<Script[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
  const [sortBy, setSortBy] = useState('difficulty');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedScripts, setSelectedScripts] = useState<number[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const fetchScripts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        channel_id: filters.channel_id || undefined,
        category_id: filters.category_id || undefined,
        difficulty: filters.difficulty || undefined,
        status: filters.status || undefined,
        sort_by: sortBy,
        order,
        include: 'category'
      };

      console.log('Frontend API Request params:', params);
      const response = await scriptsApi.getList(params);
      
      if (response.success && response.data) {
        setScripts(response.data.items || []);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total || 0,
            pages: Math.ceil((response.data.pagination.total || 0) / pagination.limit),
          }));
        }
      } else {
        enqueueSnackbar(response.message || '获取脚本列表失败', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('API Error:', error);
      enqueueSnackbar(error.message || '获取脚本列表失败', { variant: 'error' });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sortBy, order, enqueueSnackbar]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  const fetchChannels = useCallback(async () => {
    try {
      const response = await channelsApi.getList({});
      if (response.success) {
        setChannels(response.data.items);
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '获取频道列表失败', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getList({
        limit: 100,
        sort_by: 'category_name',
        order: 'asc'
      });
      
      if (response.success) {
        setCategories(response.data.items);
      } else {
        enqueueSnackbar(response.message || '获取分类列表失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '获取分类列表失败', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchChannels();
    fetchCategories();
  }, [fetchChannels, fetchCategories]);

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

  // 渲染星级
  const renderStars = (difficulty: number) => {
    if (!difficulty) {
      return <Typography variant="body2" color="text.secondary">未设置</Typography>;
    }
    return (
      <Stack direction="row" spacing={0.5}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            sx={{
              color: star <= difficulty ? 'warning.main' : 'action.disabled',
              fontSize: '1.2rem',
            }}
          />
        ))}
      </Stack>
    );
  };

  // 处理行选择
  const handleRowSelect = (scriptId: number) => {
    setSelectedScripts(prev => {
      if (prev.includes(scriptId)) {
        return prev.filter(id => id !== scriptId);
      }
      return [...prev, scriptId];
    });
  };

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (!window.confirm(`确定要删除选中的 ${selectedScripts.length} 个脚本吗？`)) return;

    try {
      const deletePromises = selectedScripts.map(id => scriptsApi.delete(id));
      await Promise.all(deletePromises);
      enqueueSnackbar('批量删除成功', { variant: 'success' });
      setSelectedScripts([]);
      fetchScripts();
    } catch (error: any) {
      enqueueSnackbar(error.message || '批量删除失败', { variant: 'error' });
    }
  };

  // 获取分类名称的辅助函数
  const getCategoryName = (script: Script): string => {
    if (script.category) {
      return script.category.category_name || '未知分类';
    }
    
    // 如果category对象不存在，但有category_id，尝试从categories列表中查找
    if (script.category_id) {
      const category = categories.find(c => c.category_id === script.category_id);
      if (category) {
        return category.category_name;
      }
    }
    
    return '-';
  };

  // 获取频道名称的辅助函数
  const getChannelName = (script: Script): string => {
    if (script.channel) {
      return script.channel.channel_name || '未知频道';
    }
    
    // 如果channel对象不存在，但有channel_id，尝试从channels列表中查找
    if (script.channel_id) {
      const channel = channels.find(c => c.channel_id === script.channel_id);
      if (channel) {
        return channel.channel_name;
      }
    }
    
    return '未设置';
  };

  // 添加样式组件
  const StatusLabel = ({ label }: { label: string }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 24,
        padding: '0 8px',
        borderRadius: '16px',
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: 'secondary.main',
        color: 'secondary.main',
        fontSize: '0.75rem',
        fontWeight: 500,
      }}
    >
      {label}
    </Box>
  );

  const InfoLabel = ({ label }: { label: string }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 24,
        padding: '0 8px',
        borderRadius: '16px',
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: 'primary.main',
        color: 'primary.main',
        fontSize: '0.75rem',
        fontWeight: 500,
      }}
    >
      {label}
    </Box>
  );

  // 移动端脚本卡片组件
  const ScriptCard = ({ script }: { script: Script }) => (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
      onClick={() => navigate(`/scripts/${script.script_id}/edit`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1, mr: 1 }}>
            {script.title}
          </Typography>
          <Checkbox
            checked={selectedScripts.includes(script.script_id)}
            onChange={(e) => {
              e.stopPropagation();
              handleRowSelect(script.script_id);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={renderStars(script.difficulty || 0)} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={script.status || '未设置'} 
            size="small" 
            color="primary"
            variant="outlined"
          />
          <Chip 
            label={getChannelName(script)} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={getCategoryName(script)} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          最后修改: {script.updated_at
            ? format(new Date(script.updated_at), 'yyyy-MM-dd HH:mm')
            : '-'}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/scripts/${script.script_id}/edit`);
          }}
        >
          编辑
        </Button>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/scripts/${script.script_id}/preview`);
          }}
        >
          提词器
        </Button>
      </CardActions>
    </Card>
  );

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 标题和操作栏 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="500">
          影片脚本管理
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
          {selectedScripts.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              size={isMobile ? 'small' : 'medium'}
            >
              删除 ({selectedScripts.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<AccountTreeIcon />}
            onClick={() => navigate('/mindmap')}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? '思维导图' : '思维导图'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/scripts/create')}
            size={isMobile ? 'small' : 'medium'}
            sx={{ 
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            {isMobile ? '创建' : '创建脚本'}
          </Button>
        </Box>
      </Box>

      {/* 筛选和搜索区域 */}
      <Collapse in={!isMobile || showFilters}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>频道</InputLabel>
              <Select
                value={filters.channel_id}
                label="频道"
                onChange={(e) => handleFilterChange('channel_id', e.target.value)}
              >
                <MenuItem value="">全部</MenuItem>
                {channels.map((channel) => (
                  <MenuItem key={channel.channel_id} value={channel.channel_id.toString()}>
                    {channel.channel_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>分类</InputLabel>
              <Select
                value={filters.category_id}
                label="分类"
                onChange={(e) => {
                  handleFilterChange('category_id', e.target.value);
                }}
              >
                <MenuItem value="">全部</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id.toString()}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>星级</InputLabel>
              <Select
                value={filters.difficulty}
                label="星级"
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <MenuItem value="">全部</MenuItem>
                {[1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value.toString()}>
                    {renderStars(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
                  <MenuItem value="title">标题</MenuItem>
                  <MenuItem value="difficulty">星级</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
                <SortIcon sx={{ transform: order === 'desc' ? 'rotate(180deg)' : '' }} />
              </IconButton>
            </Stack>
          </Grid>
          {selectedScripts.length > 0 && (
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  已选择 {selectedScripts.length} 项
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

      {/* 脚本列表 */}
      {scripts.length === 0 && !loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            暂无脚本数据
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            您还没有创建任何脚本，点击下方按钮开始创建
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/scripts/create')}
            sx={{ 
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            创建第一个脚本
          </Button>
        </Paper>
      ) : isMobile ? (
        // 移动端卡片视图
        <Box>
          {scripts.map((script) => (
            <ScriptCard key={script.script_id} script={script} />
          ))}
        </Box>
      ) : (
        // 桌面端表格视图
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: '48px' }}>
                <Checkbox
                  checked={selectedScripts.length === scripts.length}
                  indeterminate={selectedScripts.length > 0 && selectedScripts.length < scripts.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedScripts(scripts.map(s => s.script_id));
                    } else {
                      setSelectedScripts([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ width: '25%' }}>标题</TableCell>
              <TableCell sx={{ width: '12%' }}>星级</TableCell>
              <TableCell sx={{ width: '12%' }}>状态</TableCell>
              <TableCell sx={{ width: '12%' }}>频道</TableCell>
              <TableCell sx={{ width: '12%' }}>分类</TableCell>
              <TableCell sx={{ width: '15%' }}>最后修改</TableCell>
              <TableCell align="center" sx={{ width: '60px' }}>提词器</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scripts.map((script) => (
              <TableRow
                key={script.script_id}
                hover
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/scripts/${script.script_id}/edit`);
                }}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()} sx={{ width: '48px' }}>
                  <Checkbox
                    checked={selectedScripts.includes(script.script_id)}
                    onChange={() => handleRowSelect(script.script_id)}
                  />
                </TableCell>
                <TableCell sx={{ width: '25%', pl: 2 }}>{script.title}</TableCell>
                <TableCell sx={{ width: '12%', pl: 2 }}>{renderStars(script.difficulty || 0)}</TableCell>
                <TableCell sx={{ width: '12%', pl: 2 }}>
                  <StatusLabel label={script.status || '未设置'} />
                </TableCell>
                <TableCell sx={{ width: '12%', pl: 2 }}>
                  <InfoLabel label={getChannelName(script)} />
                </TableCell>
                <TableCell sx={{ width: '12%', pl: 2 }}>
                  <InfoLabel label={getCategoryName(script)} />
                </TableCell>
                <TableCell sx={{ width: '15%', pl: 2 }}>
                  {script.updated_at
                    ? format(new Date(script.updated_at), 'yyyy-MM-dd HH:mm')
                    : '-'}
                </TableCell>
                <TableCell 
                  align="center" 
                  onClick={(e) => e.stopPropagation()} 
                  sx={{ 
                    width: '60px',
                    '& .MuiIconButton-root': {
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/scripts/${script.script_id}/preview`);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
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
          onClick={() => navigate('/scripts/create')}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ScriptManagement; 