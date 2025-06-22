import React, { useState, Suspense, memo, startTransition } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress,
  AppBar,
} from '@mui/material';
import {
  People as PeopleIcon,
  YouTube as YouTubeIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  AccountTree as AccountTreeIcon,
  History as HistoryIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LogoComponent from './LogoComponent';

const drawerWidth = 240;
const collapsedWidth = 65;
const transitionDuration = 200;

const baseMenuItems = [
  { text: '影片脚本管理', icon: <DescriptionIcon />, path: '/scripts' },
  { text: '思维导图', icon: <AccountTreeIcon />, path: '/mindmap' },
  { text: '思维导图历史', icon: <HistoryIcon />, path: '/mindmap/history' },
  { text: '分类管理', icon: <CategoryIcon />, path: '/categories' },
  { text: '频道管理', icon: <YouTubeIcon />, path: '/channels' },
  { text: '我的信息', icon: <PeopleIcon />, path: '/users' },
];

const adminMenuItems = [
  { text: '用户管理', icon: <AdminIcon />, path: '/admin/users' },
];

// Loading 占位组件
const LoadingFallback = memo(() => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: 'background.default',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    }}
  >
    <CircularProgress />
  </Box>
));

// 菜单项组件
const MenuItem = memo(({ item, isDrawerCollapsed, showText, location, handleNavigation, theme, isMobile }: any) => (
  <ListItem disablePadding>
    <ListItemButton 
      selected={location.pathname === item.path}
      onClick={() => handleNavigation(item.path)}
      sx={{
        minHeight: 48,
        justifyContent: (isDrawerCollapsed && !isMobile) ? 'center' : 'initial',
        px: 2.5,
        whiteSpace: 'nowrap',
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: (isDrawerCollapsed && !isMobile) ? 0 : 3,
          justifyContent: 'center',
          transition: theme.transitions.create(['margin'], {
            duration: transitionDuration,
          }),
        }}
      >
        {item.icon}
      </ListItemIcon>
      {isMobile ? (
        <ListItemText primary={item.text} />
      ) : (
        <Fade in={!isDrawerCollapsed && showText}>
          <ListItemText 
            primary={item.text} 
            sx={{
              opacity: (!isDrawerCollapsed && showText) ? 1 : 0,
              transition: 'opacity 0.2s',
              display: 'block',
            }}
          />
        </Fade>
      )}
    </ListItemButton>
  </ListItem>
));

const Layout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [showText, setShowText] = useState(true);

  // 动态生成菜单项
  const menuItems = React.useMemo(() => {
    const items = [...baseMenuItems];
    // 如果是管理员，添加管理员菜单
    if (user?.role === 'ADMIN') {
      items.push(...adminMenuItems);
    }
    return items;
  }, [user?.role]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsDrawerCollapsed(!isDrawerCollapsed);
      if (!isDrawerCollapsed) {
        setShowText(false);
      }
    }
  };

  const handleTransitionEnd = () => {
    if (!isDrawerCollapsed) {
      setShowText(true);
    }
  };

  const handleNavigation = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const safeNavigate = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const handleLogout = () => {
    logout();
  };

  const drawer = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 桌面端Logo区域 */}
      {!isMobile && (
        <>
          <Toolbar 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              px: 1,
              minHeight: '56px !important'
            }}
          >
            {/* Logo 区域 - 始终居中显示 */}
            <LogoComponent
              size="medium"
              showText={!isDrawerCollapsed}
              color="#ff6b35"
              onClick={() => safeNavigate('/')}
            />
          </Toolbar>
          
          {/* 折叠按钮 - 整个导航栏上下居中 */}
          <IconButton 
            onClick={handleDrawerToggle} 
            size="small"
            sx={{ 
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            {isDrawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <Divider />
        </>
      )}
      <List>
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            item={item}
            isDrawerCollapsed={isDrawerCollapsed}
            showText={showText}
            location={location}
            handleNavigation={handleNavigation}
            theme={theme}
            isMobile={isMobile}
          />
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: (isDrawerCollapsed && !isMobile) ? 'center' : 'initial',
              px: 2.5,
              whiteSpace: 'nowrap',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: (isDrawerCollapsed && !isMobile) ? 0 : 3,
                justifyContent: 'center',
                transition: theme.transitions.create(['margin'], {
                  duration: transitionDuration,
                }),
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {isMobile ? (
              <ListItemText primary="登出" />
            ) : (
              <Fade in={!isDrawerCollapsed && showText}>
                <ListItemText 
                  primary="登出" 
                  sx={{
                    opacity: (!isDrawerCollapsed && showText) ? 1 : 0,
                    transition: 'opacity 0.2s',
                    display: 'block',
                  }}
                />
              </Fade>
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 移动端顶部应用栏 */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1,
          }}
        >
          <Toolbar sx={{ minHeight: '56px !important' }}>
            <IconButton
              color="inherit"
              aria-label="打开导航菜单"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <LogoComponent
              size="medium"
              showText={true}
              color="#ff6b35"
              onClick={() => safeNavigate('/')}
            />
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="nav"
        sx={{
          width: isMobile ? 0 : (isDrawerCollapsed ? collapsedWidth : drawerWidth),
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            duration: transitionDuration,
            easing: theme.transitions.easing.easeInOut,
          }),
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          onTransitionEnd={handleTransitionEnd}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: isMobile ? drawerWidth : (isDrawerCollapsed ? collapsedWidth : drawerWidth),
              boxSizing: 'border-box',
              border: 'none',
              overflowX: 'hidden',
              marginTop: isMobile ? '56px' : 0, // 移动端在顶部应用栏下方
              height: isMobile ? 'calc(100% - 56px)' : '100%',
              transition: theme.transitions.create('width', {
                duration: transitionDuration,
                easing: theme.transitions.easing.easeInOut,
              }),
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: (location.pathname.includes('/scripts/') && (location.pathname.includes('/edit') || location.pathname.includes('/create'))) ? 0 : (isMobile ? 2 : 3),
          backgroundColor: theme.palette.background.default,
          overflow: 'auto',
          position: 'relative',
          marginTop: isMobile ? '56px' : 0, // 为移动端顶部应用栏留出空间
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default memo(Layout); 