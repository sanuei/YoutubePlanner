import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  InputAdornment,
  Alert,
  Pagination,
  Stack,
  Skeleton,
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  ButtonGroup
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { adminUsersApi, AdminUser, AdminUpdateUserRequest } from '../services/api';
import { format } from 'date-fns';

const AdminUserManagement: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // 分页和筛选状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // 编辑表单状态
  const [editFormData, setEditFormData] = useState<AdminUpdateUserRequest>({
    email: '',
    displayName: '',
    role: '',
  });

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // 搜索时重置到第一页
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // 构建API参数，确保参数格式正确
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      // 只有非空搜索词时才添加搜索参数
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
      }
      
      // 添加排序参数
      if (sortBy) {
        params.sortBy = sortBy;
        params.order = order;
      }

      console.log('Fetching users with params:', params); // 调试日志
      
      let response;
      try {
        response = await adminUsersApi.getAllUsers(params);
      } catch (apiError: any) {
        console.error('Initial API call failed:', apiError);
        
        // 如果请求失败，尝试最简化的请求
        if (apiError.response?.status === 400) {
          console.warn('API call failed, trying minimal parameters');
          const minimalParams = {
            page: 1,
            limit: 10
          };
          try {
            response = await adminUsersApi.getAllUsers(minimalParams);
            console.log('Minimal request succeeded, adjusting current request');
            // 如果最简请求成功，使用当前页码重试
            if (response.success) {
              const retryParams = {
                page: currentPage,
                limit: pageSize
              };
              response = await adminUsersApi.getAllUsers(retryParams);
            }
          } catch (minimalError) {
            console.error('Even minimal request failed:', minimalError);
            throw apiError; // 抛出原始错误
          }
        } else {
          throw apiError;
        }
      }
      
      console.log('API response:', response); // 调试日志
      
      if (response.success && response.data) {
        const items = response.data.items || [];
        setUsers(items);
        
        if (response.data.pagination) {
          const paginationData = response.data.pagination;
          setTotalCount(paginationData.total || 0);
          setTotalPages(paginationData.pages || 1);
        } else {
          // 如果没有分页信息，设置默认值
          setTotalCount(items.length);
          setTotalPages(1);
        }
      } else {
        console.error('API returned error:', response);
        enqueueSnackbar(response.message || '获取用户列表失败', { variant: 'error' });
        setUsers([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      // 提供更详细的错误信息
      let errorMessage = '获取用户列表失败';
      if (error.response?.status === 400) {
        errorMessage = '请求参数错误，请检查搜索条件';
      } else if (error.response?.status === 403) {
        errorMessage = '权限不足，无法访问用户管理';
      } else if (error.response?.status === 500) {
        errorMessage = '服务器内部错误，请稍后重试';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setUsers([]); // 清空用户列表
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearchTerm, sortBy, order, enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditUser = (user: AdminUser) => {
    setCurrentUser(user);
    setEditFormData({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentUser) return;

    try {
      const response = await adminUsersApi.updateUser(currentUser.userId, editFormData);
      if (response.success) {
        enqueueSnackbar('用户信息更新成功', { variant: 'success' });
        setEditDialogOpen(false);
        fetchUsers();
      } else {
        enqueueSnackbar(response.message || '更新用户信息失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '更新用户信息失败', { variant: 'error' });
    }
  };

  const handleDeleteUser = (user: AdminUser) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!currentUser) return;

    try {
      const response = await adminUsersApi.deleteUser(currentUser.userId);
      if (response.success) {
        enqueueSnackbar('用户删除成功', { variant: 'success' });
        setDeleteDialogOpen(false);
        fetchUsers();
      } else {
        enqueueSnackbar(response.message || '删除用户失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '删除用户失败', { variant: 'error' });
    }
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // 如果点击的是当前排序字段，则切换排序方向
      const newOrder = order === 'asc' ? 'desc' : 'asc';
      setOrder(newOrder);
    } else {
      // 如果是新的排序字段，默认使用降序
      setSortBy(newSortBy);
      setOrder('desc');
    }
    
    setCurrentPage(1);
  };

  // 获取统计卡片数据
  const getStatsCards = () => {
    // 注意：这里的统计是基于当前页面的用户，实际应用中可能需要从API获取全局统计
    const adminCount = users.filter(user => user.role === 'ADMIN').length;
    const userCount = users.filter(user => user.role === 'USER').length;
    const unknownRoleCount = users.filter(user => !user.role || (user.role !== 'ADMIN' && user.role !== 'USER')).length;
    const totalScripts = users.reduce((sum, user) => sum + (user.stats?.total_scripts || 0), 0);

    return [
      {
        title: '总用户数',
        value: totalCount, // 使用API返回的总数
        icon: <PeopleIcon />,
        color: 'primary',
        bgcolor: 'primary.light'
      },
      {
        title: '当前页管理员',
        value: adminCount, // 当前页面的管理员数量
        icon: <AdminIcon />,
        color: 'error',
        bgcolor: 'error.light'
      },
      {
        title: '当前页普通用户',
        value: userCount, // 当前页面的普通用户数量
        icon: <PersonIcon />,
        color: 'success',
        bgcolor: 'success.light'
      },
      {
        title: '当前页脚本数',
        value: totalScripts, // 当前页面用户的脚本总数
        icon: <DescriptionIcon />,
        color: 'warning',
        bgcolor: 'warning.light'
      },
      ...(unknownRoleCount > 0 ? [{
        title: '角色异常用户',
        value: unknownRoleCount,
        icon: <WarningIcon />,
        color: 'error',
        bgcolor: 'error.light'
      }] : [])
    ];
  };

  if (loading && users.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 统计卡片骨架屏 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>

        {/* 搜索区域骨架屏 */}
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mb: 4 }} />

                 {/* 用户卡片骨架屏 */}
         <Grid container spacing={3}>
           {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
             <Grid key={item} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 统计卡片网格 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {getStatsCards().map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: stat.bgcolor,
                      color: 'white'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip 
                    label={<TrendingUpIcon fontSize="small" />}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

            {/* 搜索和筛选区域 */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: loading && searchTerm ? (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-end' }}>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>排序</InputLabel>
                  <Select
                    value={sortBy}
                    label="排序"
                    onChange={(e) => handleSortChange(e.target.value as string)}
                  >
                    <MenuItem value="createdAt">创建时间</MenuItem>
                    <MenuItem value="updatedAt">最后修改</MenuItem>
                    <MenuItem value="username">用户名</MenuItem>
                    <MenuItem value="role">角色</MenuItem>
                  </Select>
                </FormControl>

                <ButtonGroup size="small" variant="outlined">
                  <Button
                    onClick={() => setOrder('desc')}
                    variant={order === 'desc' ? 'contained' : 'outlined'}
                    sx={{ px: 1.5 }}
                  >
                    降序
                  </Button>
                  <Button
                    onClick={() => setOrder('asc')}
                    variant={order === 'asc' ? 'contained' : 'outlined'}
                    sx={{ px: 1.5 }}
                  >
                    升序
                  </Button>
                </ButtonGroup>

                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {loading ? '加载中...' : `共 ${totalCount || 0} 个用户`}
                </Typography>
                {loading && (
                  <CircularProgress size={16} />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 用户卡片网格 */}
      {users.length > 0 ? (
        <>
                     <Grid container spacing={3}>
             {users.map((user) => (
               <Grid key={user.userId} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    {/* 用户头像和基本信息 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          user.role === 'ADMIN' ? (
                            <AdminIcon sx={{ fontSize: 16, color: 'error.main' }} />
                          ) : user.role === 'USER' ? (
                            <PersonIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          ) : (
                            <PersonIcon sx={{ fontSize: 16, color: 'grey.main' }} />
                          )
                        }
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </Badge>
                      <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {user.displayName || user.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>

                    {/* 角色标签 */}
                    <Box sx={{ mb: 3 }}>
                      <Chip
                        icon={user.role === 'ADMIN' ? <AdminIcon /> : <PersonIcon />}
                        label={user.role === 'ADMIN' ? '管理员' : user.role === 'USER' ? '普通用户' : '未知角色'}
                        color={user.role === 'ADMIN' ? 'error' : user.role === 'USER' ? 'primary' : 'default'}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    {/* 用户信息 */}
                    <Stack spacing={1} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(user.createdAt), 'yyyy-MM-dd')}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* 统计信息 */}
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                      <Grid size={4}>
                        <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'grey.50' }}>
                          <Typography variant="h6" fontWeight="bold">
                            {user.stats?.total_scripts || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            脚本
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid size={4}>
                        <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'grey.50' }}>
                          <Typography variant="h6" fontWeight="bold">
                            {user.stats?.total_channels || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            频道
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid size={4}>
                        <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'grey.50' }}>
                          <Typography variant="h6" fontWeight="bold">
                            {user.stats?.total_categories || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            分类
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* 操作按钮 */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditUser(user)}
                        fullWidth
                      >
                        编辑
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteUser(user)}
                        fullWidth
                      >
                        删除
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

                     {/* 分页 */}
           {totalPages > 1 && (
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
               <Pagination
                 count={totalPages} // 恢复完整分页功能
                 page={currentPage}
                 onChange={handlePageChange}
                 color="primary"
                 size="large"
                 showFirstButton
                 showLastButton
               />

             </Box>
           )}
        </>
             ) : (
         /* 空状态 */
         <Box sx={{ textAlign: 'center', py: 8 }}>
           <PeopleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
           <Typography variant="h6" color="text.secondary" gutterBottom>
             暂无用户数据
           </Typography>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
             {debouncedSearchTerm ? '没有找到匹配的用户' : '系统中还没有用户数据'}
           </Typography>
           

           
           <Button 
             variant="outlined" 
             onClick={fetchUsers}
             disabled={loading}
           >
             重新加载
           </Button>
         </Box>
       )}

      {/* 编辑用户对话框 */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EditIcon color="primary" />
            编辑用户信息
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              label="邮箱地址"
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="显示名称"
              value={editFormData.displayName}
              onChange={(e) => setEditFormData(prev => ({ ...prev, displayName: e.target.value }))}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth>
              <InputLabel>用户角色</InputLabel>
              <Select
                value={editFormData.role}
                onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                label="用户角色"
              >
                <MenuItem value="USER">普通用户</MenuItem>
                <MenuItem value="ADMIN">管理员</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningIcon color="error" />
            确认删除用户
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 3 }}>
            您确定要删除用户 "{currentUser?.username}" 吗？
          </Alert>
          <Typography variant="body2" color="text.secondary">
            删除用户将会同时删除该用户的所有数据，包括脚本、频道和分类等。此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            取消
          </Button>
          <Button 
            onClick={confirmDeleteUser} 
            variant="contained"
            color="error"
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUserManagement; 