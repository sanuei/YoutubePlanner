/*
 * 创建日期: 2024-12-XX
 * 文件说明: 思维导图历史管理组件，显示用户保存的思维导图列表
 * 作者: Yann
 * 模块: components
 * 版本: 1.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Tooltip,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Checkbox,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Chip,
  Collapse,
  Fab,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  AccountTree as AccountTreeIcon,
  FilterList as FilterListIcon,
  ExpandLess as ExpandLessIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { mindMapsApi, MindMapListResponse } from '../services/api';

const MindMapHistory: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  
  // 状态管理
  const [mindMaps, setMindMaps] = useState<MindMapListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMapListResponse | null>(null);
  const [selectedMindMaps, setSelectedMindMaps] = useState<number[]>([]);

  // 分页和筛选状态
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState({
    search: '',
    date_from: '',
    date_to: '',
  });
  const [sortBy, setSortBy] = useState('updated_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // 加载思维导图列表
  const loadMindMaps = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mindMapsApi.getUserMindMaps({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search.trim() || undefined,
      });
      
      if (response.success) {
        // 前端排序
        let sortedItems = [...response.data.items];
        sortedItems.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (sortBy) {
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'created_at':
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
            case 'updated_at':
            default:
              aValue = new Date(a.updatedAt);
              bValue = new Date(b.updatedAt);
              break;
          }
          
          if (order === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        setMindMaps(sortedItems);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        }));
      } else {
        enqueueSnackbar('加载思维导图列表失败', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('加载思维导图列表失败:', error);
      enqueueSnackbar(error.message || '加载失败，请稍后重试', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sortBy, order, enqueueSnackbar]);

  // 初始加载和依赖更新
  useEffect(() => {
    loadMindMaps();
  }, [loadMindMaps]);

  // 处理筛选变化
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // 重置页码
  };

  // 处理分页
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  // 处理查看思维导图
  const handleView = (mindMap: MindMapListResponse) => {
    navigate(`/mindmap/edit/${mindMap.mindMapId}`);
  };

  // 处理编辑思维导图
  const handleEdit = (mindMap: MindMapListResponse) => {
    navigate(`/mindmap/edit/${mindMap.mindMapId}`);
  };

  // 处理删除思维导图
  const handleDelete = (mindMap: MindMapListResponse) => {
    setSelectedMindMap(mindMap);
    setDeleteDialogOpen(true);
  };

  // 处理行选择
  const handleRowSelect = (mindMapId: number) => {
    setSelectedMindMaps(prev => {
      if (prev.includes(mindMapId)) {
        return prev.filter(id => id !== mindMapId);
      }
      return [...prev, mindMapId];
    });
  };

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (!window.confirm(`确定要删除选中的 ${selectedMindMaps.length} 个思维导图吗？`)) return;

    try {
      const deletePromises = selectedMindMaps.map(id => mindMapsApi.delete(id));
      await Promise.all(deletePromises);
      enqueueSnackbar('批量删除成功', { variant: 'success' });
      setSelectedMindMaps([]);
      loadMindMaps();
    } catch (error: any) {
      enqueueSnackbar(error.message || '批量删除失败', { variant: 'error' });
    }
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!selectedMindMap) return;

    try {
      const response = await mindMapsApi.delete(selectedMindMap.mindMapId);
      if (response.success) {
        enqueueSnackbar('思维导图删除成功', { variant: 'success' });
        loadMindMaps(); // 重新加载列表
      } else {
        enqueueSnackbar('删除失败', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('删除思维导图失败:', error);
      enqueueSnackbar(error.message || '删除失败，请稍后重试', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedMindMap(null);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch {
      return dateString;
    }
  };

  // 移动端思维导图卡片组件
  const MindMapCard = ({ mindMap }: { mindMap: MindMapListResponse }) => (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
      onClick={() => navigate(`/mindmap/edit/${mindMap.mindMapId}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1, mr: 1 }}>
            {mindMap.title}
          </Typography>
          <Checkbox
            checked={selectedMindMaps.includes(mindMap.mindMapId)}
            onChange={(e) => {
              e.stopPropagation();
              handleRowSelect(mindMap.mindMapId);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {mindMap.description || '暂无描述'}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={`创建: ${formatDate(mindMap.createdAt)}`} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={`更新: ${formatDate(mindMap.updatedAt)}`} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/mindmap/edit/${mindMap.mindMapId}`);
          }}
        >
          编辑
        </Button>
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/mindmap/edit/${mindMap.mindMapId}`);
          }}
        >
          查看
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
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
          思维导图历史
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={showFilters ? <ExpandLessIcon /> : <FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              筛选
            </Button>
          )}
          {selectedMindMaps.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              size={isMobile ? 'small' : 'medium'}
            >
              删除 ({selectedMindMaps.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/mindmap/create')}
            size={isMobile ? 'small' : 'medium'}
            sx={{ 
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            {isMobile ? '新建' : '新建思维导图'}
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
                placeholder="搜索思维导图标题..."
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
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControl size="small">
                  <InputLabel>排序</InputLabel>
                  <Select
                    value={sortBy}
                    label="排序"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="updated_at">最后修改</MenuItem>
                    <MenuItem value="created_at">创建时间</MenuItem>
                    <MenuItem value="title">标题</MenuItem>
                  </Select>
                </FormControl>
                <IconButton onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
                  <SortIcon sx={{ transform: order === 'desc' ? 'rotate(180deg)' : '' }} />
                </IconButton>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 5 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                {selectedMindMaps.length > 0 && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      已选择 {selectedMindMaps.length} 项
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
                )}
                <Typography variant="body2" color="text.secondary">
                  共 {pagination.total} 个思维导图
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* 思维导图列表 */}
      {isMobile ? (
        // 移动端卡片视图
        <Box>
          {mindMaps.map((mindMap) => (
            <MindMapCard key={mindMap.mindMapId} mindMap={mindMap} />
          ))}
        </Box>
      ) : (
        // 桌面端表格视图
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: '48px' }}>
                    <Checkbox
                      checked={selectedMindMaps.length === mindMaps.length && mindMaps.length > 0}
                      indeterminate={selectedMindMaps.length > 0 && selectedMindMaps.length < mindMaps.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMindMaps(mindMaps.map(m => m.mindMapId));
                        } else {
                          setSelectedMindMaps([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ width: '30%' }}>标题</TableCell>
                  <TableCell sx={{ width: '35%' }}>描述</TableCell>
                  <TableCell sx={{ width: '15%' }}>创建时间</TableCell>
                  <TableCell sx={{ width: '15%' }}>更新时间</TableCell>
                  <TableCell align="center" sx={{ width: '120px' }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mindMaps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AccountTreeIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          {filters.search ? '没有找到匹配的思维导图' : '还没有创建任何思维导图'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {filters.search ? '尝试使用其他关键词搜索' : '开始创建您的第一个思维导图吧'}
                        </Typography>
                        {!filters.search && (
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/mindmap/create')}
                          >
                            新建思维导图
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  mindMaps.map((mindMap) => (
                    <TableRow
                      key={mindMap.mindMapId}
                      hover
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/mindmap/edit/${mindMap.mindMapId}`);
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()} sx={{ width: '48px' }}>
                        <Checkbox
                          checked={selectedMindMaps.includes(mindMap.mindMapId)}
                          onChange={() => handleRowSelect(mindMap.mindMapId)}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '30%', pl: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                          {mindMap.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '35%', pl: 2 }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {mindMap.description || '暂无描述'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '15%', pl: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(mindMap.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '15%', pl: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(mindMap.updatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={(e) => e.stopPropagation()} 
                        sx={{ 
                          width: '120px',
                          '& .MuiIconButton-root': {
                            opacity: 0.7,
                            '&:hover': {
                              opacity: 1
                            }
                          }
                        }}
                      >
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="查看">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(mindMap);
                              }}
                              color="primary"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="编辑">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(mindMap);
                              }}
                              color="secondary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(mindMap);
                              }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
          onClick={() => navigate('/mindmap/create')}
        >
          <AddIcon />
        </Fab>
      )}

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon color="error" />
            确认删除思维导图
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            此操作不可撤销，删除后将无法恢复。
          </Alert>
          <Typography>
            确定要删除思维导图 <strong>"{selectedMindMap?.title}"</strong> 吗？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            取消
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MindMapHistory; 