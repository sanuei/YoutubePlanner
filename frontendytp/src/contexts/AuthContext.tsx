import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  userId?: number;
  username: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
      userId: number;
      username: string;
    };
  };
  errors?: any;
  timestamp: string;
  requestId: string;
}

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  errors?: any;
  timestamp: string;
  requestId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string, email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Initial token check:', token);
      
      // 获取当前路径
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/' || currentPath === '/login' || currentPath === '/register';
      
      if (token) {
        try {
          // 检查token格式是否正确
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            throw new Error('Invalid token format');
          }
          
          // 检查token是否存在且未过期
          const tokenData = JSON.parse(atob(tokenParts[1]));
          const expirationTime = tokenData.exp * 1000; // 转换为毫秒
          
          console.log('Token data:', tokenData);
          console.log('Token expiration:', new Date(expirationTime));
          console.log('Current time:', new Date());
          
          if (Date.now() < expirationTime) {
            // token未过期，设置用户信息和请求头
            setUser({
              id: tokenData.userId || tokenData.sub,
              username: tokenData.username || tokenData.sub,
              email: ''
            });
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            console.log('Token is valid, user set:', tokenData.username);
            
            // 如果用户已登录且在登录/注册页面，重定向到脚本管理页面
            if (currentPath === '/login' || currentPath === '/register') {
              navigate('/scripts');
            }
          } else {
            // token已过期，尝试刷新token
            console.log('Token expired, attempting refresh');
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                console.log('Attempting to refresh token on init');
                const response = await api.post('/auth/refresh', { refreshToken });
                const { accessToken } = response.data.data;
                
                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                
                // 重新解析新token
                const newTokenData = JSON.parse(atob(accessToken.split('.')[1]));
                setUser({
                  id: newTokenData.userId || newTokenData.sub,
                  username: newTokenData.username || newTokenData.sub,
                  email: ''
                });
                console.log('Token refreshed successfully on init');
              } catch (refreshError) {
                console.error('Token refresh failed on init:', refreshError);
                // 刷新失败，清除存储
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                delete api.defaults.headers.common.Authorization;
                
                if (!isPublicRoute) {
                  navigate('/login');
                }
              }
            } else {
              // 没有refresh token，清除存储
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              delete api.defaults.headers.common.Authorization;
              
              if (!isPublicRoute) {
                navigate('/login');
              }
            }
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // token解析失败，清除存储
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common.Authorization;
          
          // 只有在非公共路由时才重定向到登录页
          if (!isPublicRoute) {
            navigate('/login');
          }
        }
      } else {
        // 没有token，只有在非公共路由时才重定向到登录页
        if (!isPublicRoute) {
          navigate('/login');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [navigate]);

  // 响应拦截器已在 api.ts 中处理，这里不需要重复添加

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login for user:', username);
      console.log('API base URL:', process.env.REACT_APP_API_BASE_URL);
      
      const response = await api.post<LoginResponse>('/auth/login', { username, password });
      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);
      console.log('Login response data:', response.data);

      // 检查响应是否成功
      if (response.data && response.data.success && response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;
        console.log('Extracted tokens and user:', { 
          accessToken: accessToken ? 'present' : 'missing', 
          refreshToken: refreshToken ? 'present' : 'missing', 
          user 
        });
        
        if (accessToken && refreshToken && user) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          console.log('Tokens stored and Authorization header set');
          
          const userData = {
            id: user.userId || 0,
            username: user.username,
            email: ''
          };
          console.log('Setting user data:', userData);
          setUser(userData);
          
          console.log('Navigating to /scripts after successful login');
          navigate('/scripts');
          return { success: true, message: '登录成功' };
        } else {
          console.error('Login failed - Missing tokens or user data');
          return { success: false, message: '登录失败：服务器响应数据不完整' };
        }
      } else {
        console.error('Login failed - Invalid response structure:', response.data);
        return { success: false, message: response.data?.message || '登录失败：服务器响应格式错误' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      let errorMessage = '登录失败，请重试';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const register = useCallback(async (username: string, password: string, email: string) => {
    try {
      console.log('Attempting registration with:', { username, email });
      const response = await api.post<ApiResponse<{ userId: number; username: string }>>('/auth/register', {
        username,
        password,
        email
      });
      
      console.log('Registration response:', response);
      console.log('Response data:', response.data);
      
      // 检查响应状态码和成功标志 - 现在response是完整的axios响应对象
      if (response.data?.success && response.data?.code === 201) {
        console.log('Registration successful');
        
        // 延迟导航，让用户看到成功消息
        setTimeout(() => {
          console.log('Navigating to login page');
          navigate('/login', { replace: true });
        }, 2000);
        
        return { 
          success: true, 
          message: response.data.message || '注册成功' 
        };
      }
      
      console.error('Registration failed - Invalid response:', response);
      return { 
        success: false, 
        message: response.data?.message || '注册失败' 
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || '注册失败，请重试' 
      };
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common.Authorization;
    console.log('Cleared Authorization header after logout');
    setUser(null);
    navigate('/');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 