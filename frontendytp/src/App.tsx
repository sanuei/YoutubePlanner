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

// 导入i18n配置
import './i18n';

// 懒加载页面组件
const HomePage = lazy(() => import('./components/HomePage'));
const Changelog = lazy(() => import('./components/Changelog'));
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
        {/* 公开页面 - 精确匹配，优先级最高 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* 受保护页面 - 需要认证 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/channels" replace />} />
        </Route>

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserManagement />} />
        </Route>

        <Route
          path="/channels"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChannelList />} />
        </Route>

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CategoryManagement />} />
        </Route>

        <Route
          path="/scripts/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ScriptManagement />} />
          <Route path="create" element={<ScriptEdit />} />
          <Route path=":scriptId/edit" element={<ScriptEdit />} />
          <Route path=":id/preview" element={<ScriptPreview />} />
        </Route>

        <Route
          path="/mindmap/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MindMapEditor />} />
          <Route path="create" element={<MindMapEditor />} />
          <Route path="edit/:mindMapId" element={<MindMapEditor />} />
          <Route path="history" element={<MindMapHistory />} />
        </Route>

        {/* 管理员专用路由 */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </AdminRoute>
          }
        >
          <Route index element={<AdminUserManagement />} />
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
