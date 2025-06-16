import React, { useState, startTransition } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import LogoComponent from './LogoComponent';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from 'notistack';

const GlassContainer = styled(motion(Paper))(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: '0 auto', // 水平居中
    maxWidth: 'calc(100vw - 48px)', // 确保在移动端不会超出屏幕，留出更多边距
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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

const StyledButton = styled(Button)(({ theme }) => ({
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

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // 安全的导航函数，使用 startTransition 避免 Suspense 错误
  const safeNavigate = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting login form with username:', formData.username);
      const result = await login(formData.username, formData.password);
      console.log('Login result:', result);
      
      if (!result.success) {
        console.error('Login failed:', result.message);
        enqueueSnackbar(result.message || '登录失败，请重试', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Login error in component:', error);
      const errorMessage = error.response?.data?.message || error.message || '登录失败，请重试';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        padding: theme.spacing(2),
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      {/* Logo 区域 */}
      {!isMobile ? (
        // 桌面端：Logo在左上角
        <Box
          sx={{
            position: 'absolute',
            top: theme.spacing(3),
            left: theme.spacing(3),
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 2,
            '&:hover': {
              opacity: 0.8,
            },
          }}
          onClick={() => safeNavigate('/')}
        >
          <LogoComponent
            size="medium"
            showText={true}
            color="white"
          />
        </Box>
      ) : (
        // 移动端：Logo在表单上方，与主页保持一致
        <Box
          sx={{
            position: 'absolute',
            top: theme.spacing(3),
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 2,
            '&:hover': {
              opacity: 0.8,
            },
          }}
          onClick={() => safeNavigate('/')}
        >
          <LogoComponent
            size="medium"
            showText={false}
            color="white"
          />
        </Box>
      )}

      {/* 装饰性元素 */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          zIndex: 0,
        }}
      />

      {/* 主要内容区域 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: isMobile ? '100%' : '1200px',
          gap: isMobile ? 2 : 4,
          zIndex: 1,
          flexDirection: isMobile ? 'column' : 'row',
          px: isMobile ? 2 : 0,
          pt: isMobile ? 8 : 0, // 移动端添加顶部内边距，避免与Logo重叠
        }}
      >
        {/* 左侧介绍区域 */}
        {!isMobile && (
          <Box sx={{ flex: 1, color: 'white', pr: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                欢迎回来！
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
              >
                继续您的 YouTube 内容创作之旅，管理频道、编辑脚本、规划发布。
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoLibraryIcon sx={{ fontSize: '1.5rem' }} />
                  <Typography>频道管理</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: '1.5rem' }} />
                  <Typography>脚本编辑</Typography>
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1,
                opacity: 0.8
              }}>
                <Typography variant="body2">
                  ✨ 10,000+ 活跃用户
                </Typography>
                <Typography variant="body2">
                  📝 50,000+ 管理脚本
                </Typography>
                <Typography variant="body2">
                  🎯 99.9% 正常运行时间
                </Typography>
              </Box>
            </motion.div>
          </Box>
        )}

        {/* 右侧登录表单 */}
        <Box sx={{ 
          flex: isMobile ? 'none' : 1, 
          width: isMobile ? '100%' : 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isMobile ? 'auto' : 'auto',
        }}>
          <GlassContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #ff6b35 30%, #ff8a65 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  欢迎回来
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                  登录以继续使用 YouTube Planner
                </Typography>
              </Box>

              <StyledTextField
                required
                fullWidth
                name="username"
                placeholder="用户名"
                value={formData.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                required
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="密码"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  '登 录'
                )}
              </StyledButton>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  还没有账号？{' '}
                  <Link
                    to="/register"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    立即注册
                  </Link>
                </Typography>
              </Box>
            </Box>
          </GlassContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Login; 