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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  YouTube as YouTubeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandLess as ExpandLessIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { channelsApi, categoriesApi, Channel, Category } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const ChannelList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [editChannel, setEditChannel] = useState<Channel | null>(null);
  const [channelName, setChannelName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  // 分页状态
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // 筛选状态
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
  });

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await channelsApi.getList({
        search: debouncedSearch,
        sort_by: sortBy,
        order,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      if (response.success) {
        setChannels(response.data.items);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total || 0,
            pages: Math.ceil((response.data.pagination.total || 0) / pagination.limit),
          }));
        }
      } else {
        enqueueSnackbar(response.message || '获取频道列表失败', { variant: 'error' });
        setChannels([]);
      }
    } catch (error) {
      console.error('获取频道列表失败:', error);
      enqueueSnackbar('获取频道列表失败', { variant: 'error' });
      setChannels([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [debouncedSearch, sortBy, order, pagination.page, pagination.limit, enqueueSnackbar]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getList({
        limit: 100,
      });
      
      if (response.success) {
        setCategories(response.data.items);
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  }, []);

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

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      enqueueSnackbar('请输入频道名称', { variant: 'warning' });
      return;
    }
    
    try {
      await channelsApi.create(channelName, user?.id);
      enqueueSnackbar('创建频道成功', { variant: 'success' });
      setOpenDialog(false);
      setChannelName('');
      fetchChannels();
    } catch (error) {
      console.error('创建频道失败:', error);
      enqueueSnackbar('创建频道失败', { variant: 'error' });
    }
  };

  const handleUpdateChannel = async () => {
    if (!editChannel || !channelName.trim()) {
      enqueueSnackbar('请输入频道名称', { variant: 'warning' });
      return;
    }
    
    try {
      await channelsApi.update(editChannel.channel_id, channelName);
      enqueueSnackbar('更新频道成功', { variant: 'success' });
      setOpenDialog(false);
      setEditChannel(null);
      setChannelName('');
      fetchChannels();
    } catch (error) {
      console.error('更新频道失败:', error);
      enqueueSnackbar('更新频道失败', { variant: 'error' });
    }
  };

  const handleBatchDelete = async () => {
    if (!window.confirm('确定要删除选中的频道吗？')) return;
    
    try {
      await Promise.all(selectedChannels.map(id => channelsApi.delete(id)));
      enqueueSnackbar('删除频道成功', { variant: 'success' });
      setSelectedChannels([]);
      fetchChannels();
    } catch (error) {
      console.error('删除频道失败:', error);
      enqueueSnackbar('删除频道失败', { variant: 'error' });
    }
  };

  const handleOpenDialog = (channel?: Channel) => {
    if (channel) {
      setEditChannel(channel);
      setChannelName(channel.channel_name);
    } else {
      setEditChannel(null);
      setChannelName('');
    }
    setOpenDialog(true);
  };

  const handleRowSelect = (channelId: number) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // 获取频道的分类列表
  const getChannelCategories = (channelId: number) => {
    return categories.filter(category => 
      category.user_id === user?.id
    );
  };

  // 频道卡片组件（移动端）
  const ChannelCard = ({ channel }: { channel: Channel }) => {
    const channelCategories = getChannelCategories(channel.channel_id);
    const isSelected = selectedChannels.includes(channel.channel_id);

    return (
      <Card 
        elevation={0}
        sx={{ 
          mb: 2,
          border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
          borderRadius: 1.5,
          position: 'relative',
          ...(isSelected && {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
          })
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Checkbox
              checked={isSelected}
              onChange={() => handleRowSelect(channel.channel_id)}
            />
            
            <Avatar sx={{ bgcolor: 'error.main' }}>
              <YouTubeIcon />
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {channel.channel_name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {channel.scripts_count || 0} 个脚本 • {channelCategories.length} 个分类
              </Typography>
              
              {channelCategories.length > 0 && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {channelCategories.slice(0, 2).map((category) => (
                    <Chip
                      key={category.category_id}
                      label={category.category_name}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  ))}
                  {channelCategories.length > 2 && (
                    <Chip
                      label={`+${channelCategories.length - 2}`}
                      size="small"
                      variant="filled"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                </Stack>
              )}
            </Box>
            
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(channel)}
            >
              <EditIcon />
            </IconButton>
          </Stack>
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
          {Array.from(new Array(6)).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
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
          频道管理
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
          {selectedChannels.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              size={isMobile ? 'small' : 'medium'}
            >
              删除 ({selectedChannels.length})
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
            {isMobile ? '创建' : '创建频道'}
          </Button>
        </Box>
      </Box>

      {/* 筛选和搜索区域 */}
      <Collapse in={!isMobile || showFilters}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="搜索频道..."
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>分类</InputLabel>
                <Select
                  value={filters.category_id}
                  label="分类"
                  onChange={(e) => handleFilterChange('category_id', e.target.value)}
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    <MenuItem value="channel_name">频道名称</MenuItem>
                  </Select>
                </FormControl>
                <IconButton onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
                  <SortIcon sx={{ transform: order === 'desc' ? 'rotate(180deg)' : '' }} />
                </IconButton>
              </Stack>
            </Grid>
            {selectedChannels.length > 0 && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    已选择 {selectedChannels.length} 项
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

      {/* 频道列表 */}
      {channels.length === 0 && !loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            暂无频道数据
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            您还没有创建任何频道，点击下方按钮开始创建
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
            创建第一个频道
          </Button>
        </Paper>
      ) : isMobile ? (
        // 移动端卡片视图
        <Box>
          {channels.map((channel) => (
            <ChannelCard key={channel.channel_id} channel={channel} />
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
                    checked={selectedChannels.length === channels.length && channels.length > 0}
                    indeterminate={selectedChannels.length > 0 && selectedChannels.length < channels.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChannels(channels.map(c => c.channel_id));
                      } else {
                        setSelectedChannels([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ width: '40%' }}>频道名称</TableCell>
                <TableCell sx={{ width: '15%' }}>脚本数量</TableCell>
                <TableCell sx={{ width: '15%' }}>分类数量</TableCell>
                <TableCell sx={{ width: '20%' }}>创建时间</TableCell>
                <TableCell align="center" sx={{ width: '10%' }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {channels.map((channel) => {
                const channelCategories = getChannelCategories(channel.channel_id);
                return (
                  <TableRow
                    key={channel.channel_id}
                    hover
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell 
                      padding="checkbox" 
                      onClick={(e) => e.stopPropagation()} 
                      sx={{ width: '48px' }}
                    >
                      <Checkbox
                        checked={selectedChannels.includes(channel.channel_id)}
                        onChange={() => handleRowSelect(channel.channel_id)}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                          <YouTubeIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {channel.channel_name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ width: '15%' }}>
                      <Chip 
                        label={channel.scripts_count || 0} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell sx={{ width: '15%' }}>
                      <Chip 
                        label={channelCategories.length} 
                        size="small" 
                        variant="outlined"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell sx={{ width: '20%' }}>
                      {channel.created_at
                        ? format(new Date(channel.created_at), 'yyyy-MM-dd HH:mm')
                        : '-'}
                    </TableCell>
                    <TableCell 
                      align="center" 
                      onClick={(e) => e.stopPropagation()} 
                      sx={{ width: '10%' }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(channel)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
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
              <YouTubeIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" fontWeight={600}>
                {editChannel ? '编辑频道' : '创建频道'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {editChannel ? '修改频道信息' : '创建新的YouTube频道'}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="频道名称"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="请输入频道名称"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTubeIcon color="action" />
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
            onClick={editChannel ? handleUpdateChannel : handleCreateChannel} 
            variant="contained"
            sx={{ 
              minWidth: 80,
              boxShadow: 'none',
              '&:hover': { boxShadow: 1 }
            }}
          >
            {editChannel ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChannelList; 