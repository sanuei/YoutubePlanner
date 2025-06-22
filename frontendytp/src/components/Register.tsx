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
  Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
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

const Register: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // 安全的导航函数，使用 startTransition 避免 Suspense 错误
  const safeNavigate = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // 用户名验证
    if (!formData.username) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = '用户名长度必须在3-20个字符之间';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else {
      // 检查密码长度
      if (formData.password.length < 8 || formData.password.length > 128) {
        newErrors.password = '密码长度必须在8-128个字符之间';
      } else {
        // 检查是否包含小写字母
        const hasLowerCase = /[a-z]/.test(formData.password);
        // 检查是否包含大写字母
        const hasUpperCase = /[A-Z]/.test(formData.password);
        // 检查是否包含数字
        const hasNumber = /\d/.test(formData.password);
        // 检查是否包含特殊字符（更宽泛的特殊字符集合）
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`！]/.test(formData.password);
        
        if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
          newErrors.password = '密码必须包含大小写字母、数字和特殊字符';
        }
      }
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
          try {
        const result = await register(formData.username, formData.password, formData.email);
        
        if (result.success) {
          enqueueSnackbar('注册成功！请登录', { variant: 'success' });
          navigate('/login');
        } else {
          enqueueSnackbar(result.message || '注册失败，请重试', { 
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    } catch (error: any) {
      console.error('Registration error in component:', error);
      if (error.response?.data?.errors) {
        // 处理后端返回的字段错误
        const fieldErrors = error.response.data.errors.reduce((acc: any, err: any) => {
          acc[err.field] = err.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        enqueueSnackbar(error.message || '注册失败，请重试', { 
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 清除对应字段的错误
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
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
                加入我们！
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
              >
                开始您的 YouTube 内容创作之旅，管理频道、编辑脚本、规划发布。
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

        {/* 右侧注册表单 */}
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
                  创建账号
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                  加入 YouTube Planner 开始规划你的内容
                </Typography>
              </Box>

              <StyledTextField
                required
                fullWidth
                name="username"
                placeholder="用户名"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
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
                name="email"
                type="email"
                placeholder="电子邮箱"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary' }} />
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
                error={!!errors.password}
                helperText={errors.password}
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

              <StyledTextField
                required
                fullWidth
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="确认密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Alert severity="info" sx={{ mt: 1, fontSize: '0.8rem' }}>
                <strong>密码要求：</strong>8-128字符，包含大小写字母、数字和特殊字符
              </Alert>

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
                  '注 册'
                )}
              </StyledButton>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  已有账号？{' '}
                  <Link
                    to="/login"
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
                    立即登录
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

export default Register; 