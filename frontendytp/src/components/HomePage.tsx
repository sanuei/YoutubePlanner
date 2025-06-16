import React, { startTransition } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Rating,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  VideoLibrary as VideoLibraryIcon,
  Edit as EditIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  GitHub as GitHubIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import LogoComponent from './LogoComponent';
import { useAuth } from '../contexts/AuthContext';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
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
}));

const FeatureCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatsBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // 平滑滚动到指定区域
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 安全的导航函数，使用 startTransition 避免 Suspense 错误
  const safeNavigate = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const features = [
    {
      icon: <VideoLibraryIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '频道管理',
      description: '轻松管理多个 YouTube 频道，统一规划内容策略',
    },
    {
      icon: <EditIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: '脚本编辑',
      description: '强大的脚本编辑器，支持多章节管理和实时预览',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: '发布计划',
      description: '智能发布计划，帮您在最佳时间发布内容',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      title: '数据分析',
      description: '深入的数据分析，了解内容表现和观众喜好',
    },
  ];

  const testimonials = [
    {
      name: '张小明',
      role: 'YouTube 创作者',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'YouTube Planner 让我的内容创作效率提升了 300%，强烈推荐！',
    },
    {
      name: '李美丽',
      role: '教育频道主',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      comment: '脚本管理功能太棒了，再也不用担心内容混乱的问题。',
    },
    {
      name: '王大力',
      role: '科技博主',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      comment: '界面简洁美观，功能强大实用，是创作者的必备工具。',
    },
  ];

  const stats = [
    { number: '10,000+', label: '活跃用户' },
    { number: '50,000+', label: '管理脚本' },
    { number: '1,000+', label: '频道' },
    { number: '99.9%', label: '正常运行时间' },
  ];

  return (
    <Box>
      {/* 顶部导航栏 */}
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          {/* Logo 区域 */}
          <LogoComponent
            size="medium"
            showText={true}
            color={theme.palette.primary.main}
            onClick={() => safeNavigate('/')}
          />
          
          {/* 中间导航按钮区域 */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, ml: 6 }}>
              <Button 
                color="inherit" 
                sx={{ color: 'text.primary' }}
                onClick={() => scrollToSection('about')}
              >
                产品介绍
              </Button>
              <Button 
                color="inherit" 
                sx={{ color: 'text.primary' }}
                onClick={() => scrollToSection('features')}
              >
                功能特色
              </Button>
              <Button 
                color="inherit" 
                sx={{ color: 'text.primary' }}
                href="https://github.com/sanuei/YoutubePlanner"
                target="_blank"
                rel="noopener noreferrer"
              >
                联系我们
              </Button>
            </Box>
          )}
          
          {/* 右侧按钮区域 */}
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            {user ? (
              <Button
                variant="contained"
                onClick={() => safeNavigate('/scripts')}
                sx={{ 
                  px: 3,
                  color: 'white',
                  '&:hover': {
                    color: 'white'
                  }
                }}
              >
                进入应用
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  onClick={() => safeNavigate('/login')}
                  sx={{ color: theme.palette.primary.main }}
                >
                  登录
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => safeNavigate('/register')}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      color: 'white'
                    }
                  }}
                >
                  注册
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero 区域 */}
      <HeroSection id="about">
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: 4
          }}>
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  sx={{ fontWeight: 'bold', mb: 2 }}
                >
                  让 YouTube 内容创作
                  <br />
                  变得更简单
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
                >
                  专业的 YouTube 内容管理平台，帮助创作者高效管理频道、编辑脚本、规划发布，让您专注于创造优质内容。
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {user ? (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => safeNavigate('/scripts')}
                      sx={{
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      进入应用
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => safeNavigate('/register')}
                        sx={{
                          backgroundColor: 'white',
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        立即开始
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => safeNavigate('/login')}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        查看演示
                      </Button>
                    </>
                  )}
                </Box>
              </motion.div>
            </Box>
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      zIndex: -1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/app-screenshot.png"
                    alt="YouTube Planner 界面预览"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* 数据统计区域 */}
      <Box sx={{ py: 6, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            gap: 2
          }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ minWidth: '200px', textAlign: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StatsBox>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </StatsBox>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 功能特色区域 */}
      <Box id="features" sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}
            >
              强大功能，助力创作
            </Typography>
            <Typography
              variant="h6"
              sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}
            >
              一站式解决 YouTube 内容创作的所有需求
            </Typography>
          </motion.div>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center'
          }}>
            {features.map((feature, index) => (
              <Box key={index} sx={{ 
                width: { xs: '100%', sm: '45%', md: '22%' },
                minWidth: '250px'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 用户评价区域 */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}
            >
              用户好评如潮
            </Typography>
            <Typography
              variant="h6"
              sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}
            >
              看看其他创作者怎么说
            </Typography>
          </motion.div>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center'
          }}>
            {testimonials.map((testimonial, index) => (
              <Box key={index} sx={{ 
                width: { xs: '100%', md: '30%' },
                minWidth: '300px'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <TestimonialCard>
                    <Box>
                      <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                        "{testimonial.comment}"
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar alt={testimonial.name}>
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </TestimonialCard>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA 区域 */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                准备好开始了吗？
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                加入数万名创作者，让内容创作变得更简单
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {user ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => safeNavigate('/scripts')}
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    进入应用
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => safeNavigate('/register')}
                      sx={{
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      免费注册
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => safeNavigate('/login')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      立即登录
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* 页脚 */}
      <Box sx={{ py: 6, backgroundColor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'space-between'
          }}>
            <Box sx={{ minWidth: '250px', flex: 1 }}>
              <LogoComponent
                size="medium"
                showText={true}
                color="white"
                onClick={() => safeNavigate('/')}
              />
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                专业的 YouTube 内容管理平台，让创作变得更简单。
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label="专业" 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    '& .MuiChip-label': { fontWeight: 'bold' }
                  }} 
                />
                <Chip 
                  label="高效" 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    '& .MuiChip-label': { fontWeight: 'bold' }
                  }} 
                />
                <Chip 
                  label="易用" 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    '& .MuiChip-label': { fontWeight: 'bold' }
                  }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ minWidth: '120px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                产品
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  功能特色
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  价格方案
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  更新日志
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ minWidth: '120px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                支持
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  帮助中心
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  联系我们
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  反馈建议
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ minWidth: '120px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                公司
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  关于我们
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  隐私政策
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  服务条款
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ minWidth: '120px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                联系我们
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  color="inherit" 
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                  startIcon={<GitHubIcon />}
                  href="https://github.com/sanuei/YoutubePlanner"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                  startIcon={<YouTubeIcon />}
                  href="https://www.youtube.com/@sonicyann"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                  startIcon={<InstagramIcon />}
                  href="https://www.instagram.com/sonic_yann/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Button>
              </Box>
            </Box>
          </Box>
          
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              mt: 4,
              pt: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2025 YouTube Planner. sonic_yann保留所有权利。
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;