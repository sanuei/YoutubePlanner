import React, { useState } from 'react';
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
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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
    margin: theme.spacing(2),
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: 实现登录逻辑
      console.log('Login attempt:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
    } catch (error) {
      console.error('Login failed:', error);
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
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: theme.spacing(2),
      }}
    >
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
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
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
        </Box>
      </GlassContainer>
    </Box>
  );
};

export default Login; 