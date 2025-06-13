import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import ChannelList from './components/ChannelList';
import UserManagement from './components/UserManagement';
import CategoryManagement from './components/CategoryManagement';
import ScriptManagement from './components/ScriptManagement';
import ScriptCreate from './components/ScriptCreate';
import ScriptEdit from './components/ScriptEdit';
import ScriptPreview from './components/ScriptPreview';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/channels" element={<ChannelList />} />
                        <Route path="/categories" element={<CategoryManagement />} />
                        <Route path="/scripts" element={<ScriptManagement />} />
                        <Route path="/scripts/create" element={<ScriptCreate />} />
                        <Route path="/scripts/:scriptId/edit" element={<ScriptEdit />} />
                        <Route path="/scripts/:id/preview" element={<ScriptPreview />} />
                        <Route path="/" element={<Navigate to="/channels" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
