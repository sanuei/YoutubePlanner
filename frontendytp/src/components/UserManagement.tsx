import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  YouTube as YouTubeIcon,
  Category as CategoryIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { usersApi, User, Script, Channel, Category, scriptsApi, channelsApi, categoriesApi } from '../services/api';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const ITEMS_PER_PAGE = 5; // 每页显示的数量

// 随机 emoji 数组
const EMOJIS = ['😀', '😎', '🤖', '👨‍💻', '👩‍💻', '🎮', '🎯', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎬', '🎥', '📺', '🎙️', '🎤', '🎧', '🎼'];

const StyledDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }: { theme: Theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transition: theme.transitions.create(['background-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5),
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 25px 0 rgba(0, 0, 0, 0.15)',
  },
}));

const UserManagement: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    display_name: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [statsData, setStatsData] = useState({
    scripts: [] as Script[],
    channels: [] as Channel[],
    categories: [] as Category[],
  });
  const [currentPage, setCurrentPage] = useState({
    scripts: 1,
    channels: 1,
    categories: 1,
  });

  // 获取随机 emoji
  const getRandomEmoji = () => {
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  };

  // 获取用户信息
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getCurrentUser();
      setUser(response.data);
      setFormData({
        email: response.data.email,
        display_name: response.data.username,
      });
      setError(null);
    } catch (err) {
      setError('获取用户信息失败');
      enqueueSnackbar('获取用户信息失败', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStatsData = async () => {
    try {
      // 使用现有的API获取数据
      const [scriptsRes, channelsRes, categoriesRes] = await Promise.all([
        scriptsApi.getList({ limit: 100 }), // 获取前100个脚本
        channelsApi.getList({ limit: 100 }), // 获取前100个频道
        categoriesApi.getList({ limit: 100 }), // 获取前100个分类
      ]);

      setStatsData({
        scripts: scriptsRes.data.items,
        channels: channelsRes.data.items,
        categories: categoriesRes.data.items,
      });
    } catch (err) {
      enqueueSnackbar('获取统计数据失败', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchStatsData();
  }, []);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 处理密码表单输入变化
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 保存用户信息
  const handleSave = async () => {
    try {
      const response = await usersApi.updateCurrentUser(formData);
      setUser(response.data);
      setEditMode(false);
      enqueueSnackbar('用户信息更新成功', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('更新用户信息失败', { variant: 'error' });
    }
  };

  // 修改密码
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      enqueueSnackbar('两次输入的密码不一致', { variant: 'error' });
      return;
    }

    try {
      await usersApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setPasswordDialogOpen(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      enqueueSnackbar('密码修改成功', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('密码修改失败', { variant: 'error' });
    }
  };

  // 获取当前页的数据
  const getCurrentPageData = (type: 'scripts' | 'channels' | 'categories') => {
    const startIndex = (currentPage[type] - 1) * ITEMS_PER_PAGE;
    return statsData[type].slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // 计算总页数
  const getTotalPages = (type: 'scripts' | 'channels' | 'categories') => {
    return Math.ceil(statsData[type].length / ITEMS_PER_PAGE);
  };

  // 处理分页变化
  const handlePageChange = (type: 'scripts' | 'channels' | 'categories', direction: 'prev' | 'next') => {
    setCurrentPage(prev => {
      const current = prev[type];
      const total = getTotalPages(type);
      const newPage = direction === 'prev' ? current - 1 : current + 1;
      
      if (newPage < 1 || newPage > total) {
        return prev;
      }
      
      return {
        ...prev,
        [type]: newPage,
      };
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: 'calc(100vh - 88px)', // 减去顶部导航栏和padding的高度
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="500">
          我的信息
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setEditMode(true)}
            sx={{ textTransform: 'none' }}
          >
            编辑信息
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPasswordDialogOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            修改密码
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 4, flex: 1 }}>
            <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user?.avatar_url}
                alt={user?.display_name}
                sx={{ 
                  width: 120, 
                  height: 120,
                  fontSize: '3rem',
                  backgroundColor: 'primary.main',
                }}
              >
                {getRandomEmoji()}
              </Avatar>
              <Typography variant="subtitle1" color="text.secondary">
                头像
              </Typography>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {editMode ? (
                <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="用户名"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="邮箱"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="显示名称"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    size="small"
                  />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button 
                      onClick={() => setEditMode(false)}
                      sx={{ textTransform: 'none' }}
                    >
                      取消
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained"
                      sx={{ textTransform: 'none' }}
                    >
                      保存
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      用户名
                    </Typography>
                    <Typography variant="body1">
                      {user?.username}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      邮箱
                    </Typography>
                    <Typography variant="body1">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      显示名称
                    </Typography>
                    <Typography variant="body1">
                      {user?.display_name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Card sx={{ flex: 1, height: '400px', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              脚本统计 ({statsData.scripts.length})
            </Typography>
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {(getCurrentPageData('scripts') as Script[]).map((script) => (
                <ListItem key={script.script_id}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary={script.title} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton 
                onClick={() => handlePageChange('scripts', 'prev')}
                disabled={currentPage.scripts === 1}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton 
                onClick={() => handlePageChange('scripts', 'next')}
                disabled={currentPage.scripts === getTotalPages('scripts')}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, height: '400px', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              频道统计 ({statsData.channels.length})
            </Typography>
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {(getCurrentPageData('channels') as Channel[]).map((channel) => (
                <ListItem key={channel.channel_id}>
                  <ListItemIcon>
                    <YouTubeIcon />
                  </ListItemIcon>
                  <ListItemText primary={channel.channel_name} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton 
                onClick={() => handlePageChange('channels', 'prev')}
                disabled={currentPage.channels === 1}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton 
                onClick={() => handlePageChange('channels', 'next')}
                disabled={currentPage.channels === getTotalPages('channels')}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, height: '400px', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              分类统计 ({statsData.categories.length})
            </Typography>
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {(getCurrentPageData('categories') as Category[]).map((category) => (
                <ListItem key={category.category_id}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={category.category_name} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton 
                onClick={() => handlePageChange('categories', 'prev')}
                disabled={currentPage.categories === 1}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton 
                onClick={() => handlePageChange('categories', 'next')}
                disabled={currentPage.categories === getTotalPages('categories')}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <StyledDialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              textAlign: 'center',
            }}
          >
            修改密码
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledTextField
              label="当前密码"
              type="password"
              name="current_password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              label="新密码"
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              label="确认新密码"
              type="password"
              name="confirm_password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              fullWidth
              onClick={() => setPasswordDialogOpen(false)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              取消
            </Button>
            <StyledButton
              fullWidth
              onClick={handleChangePassword}
              variant="contained"
            >
              确认修改
            </StyledButton>
          </Box>
        </Box>
      </StyledDialog>
    </Box>
  );
};

export default UserManagement; 