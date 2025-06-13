import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// 懒加载页面组件
const ChannelList = lazy(() => import('./components/ChannelList'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const CategoryManagement = lazy(() => import('./components/CategoryManagement'));
const ScriptManagement = lazy(() => import('./components/ScriptManagement'));
const ScriptCreate = lazy(() => import('./components/ScriptCreate'));
const ScriptEdit = lazy(() => import('./components/ScriptEdit'));
const ScriptPreview = lazy(() => import('./components/ScriptPreview'));

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
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 受保护页面统一用 layout 包裹 */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/channels" replace />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="channels" element={<ChannelList />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="scripts" element={<ScriptManagement />} />
                <Route path="scripts/create" element={<ScriptCreate />} />
                <Route path="scripts/:scriptId/edit" element={<ScriptEdit />} />
                <Route path="scripts/:id/preview" element={<ScriptPreview />} />
              </Route>
            </Routes>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
