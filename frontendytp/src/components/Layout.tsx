import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {

  People as PeopleIcon,
  YouTube as YouTubeIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;
const collapsedWidth = 65;
const transitionDuration = 200;

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: '用户管理', icon: <PeopleIcon />, path: '/users' },
  { text: '频道管理', icon: <YouTubeIcon />, path: '/channels' },
  { text: '分类管理', icon: <CategoryIcon />, path: '/categories' },
  { text: '影片脚本管理', icon: <DescriptionIcon />, path: '/scripts' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [showText, setShowText] = useState(true);

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
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const drawer = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          px: 1,
          minHeight: '56px !important'
        }}
      >
        <Fade in={!isDrawerCollapsed && showText}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              opacity: (!isDrawerCollapsed && showText) ? 1 : 0,
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            YouTube Planner
          </Typography>
        </Fade>
        <IconButton onClick={handleDrawerToggle} size="small">
          {isDrawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: isDrawerCollapsed ? 'center' : 'initial',
                px: 2.5,
                whiteSpace: 'nowrap',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isDrawerCollapsed ? 0 : 3,
                  justifyContent: 'center',
                  transition: theme.transitions.create(['margin'], {
                    duration: transitionDuration,
                  }),
                }}
              >
                {item.icon}
              </ListItemIcon>
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
            </ListItemButton>
          </ListItem>
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
              justifyContent: isDrawerCollapsed ? 'center' : 'initial',
              px: 2.5,
              whiteSpace: 'nowrap',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isDrawerCollapsed ? 0 : 3,
                justifyContent: 'center',
                transition: theme.transitions.create(['margin'], {
                  duration: transitionDuration,
                }),
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
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
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        component="nav"
        sx={{
          width: isDrawerCollapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            duration: transitionDuration,
            easing: theme.transitions.easing.easeInOut,
          }),
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          onTransitionEnd={handleTransitionEnd}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: isDrawerCollapsed ? collapsedWidth : drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              overflowX: 'hidden',
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
          p: 3,
          backgroundColor: theme.palette.background.default,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 