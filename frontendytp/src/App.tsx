import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// 懒加载页面组件
const HomePage = lazy(() => import('./components/HomePage'));
const ChannelList = lazy(() => import('./components/ChannelList'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const AdminUserManagement = lazy(() => import('./components/AdminUserManagement'));
const CategoryManagement = lazy(() => import('./components/CategoryManagement'));
const ScriptManagement = lazy(() => import('./components/ScriptManagement'));
const ScriptEdit = lazy(() => import('./components/ScriptEdit'));
const ScriptPreview = lazy(() => import('./components/ScriptPreview'));
const MindMapEditor = lazy(() => import('./components/MindMapEditor'));
const MindMapHistory = lazy(() => import('./components/MindMapHistory'));

// 懒加载的Loading组件
const LazyLoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      backgroundColor: 'background.default',
    }}
  >
    <CircularProgress />
  </Box>
);

// 应用内容组件，处理loading状态
const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Suspense fallback={<LazyLoadingFallback />}>
      <Routes>
        {/* 首页 - 不需要认证 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* 受保护页面统一用 layout 包裹 */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Navigate to="/channels" replace />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="channels" element={<ChannelList />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="scripts" element={<ScriptManagement />} />
          <Route path="scripts/create" element={<ScriptEdit />} />
          <Route path="scripts/:scriptId/edit" element={<ScriptEdit />} />
          <Route path="scripts/:id/preview" element={<ScriptPreview />} />
          <Route path="mindmap" element={<MindMapEditor />} />
          <Route path="mindmap/create" element={<MindMapEditor />} />
          <Route path="mindmap/edit/:mindMapId" element={<MindMapEditor />} />
          <Route path="mindmap/history" element={<MindMapHistory />} />
          
          {/* 管理员专用路由 */}
          <Route 
            path="admin/users" 
            element={
              <AdminRoute>
                <AdminUserManagement />
              </AdminRoute>
            } 
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <AppContent />
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
