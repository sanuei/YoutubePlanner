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
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    userId: number;
    username: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
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
      
      if (token) {
        try {
          // 检查token是否存在且未过期
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenData.exp * 1000; // 转换为毫秒
          
          if (Date.now() < expirationTime) {
            // token未过期，设置用户信息和请求头
            setUser({
              id: tokenData.userId,
              username: tokenData.username,
              email: ''
            });
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
          } else {
            // token已过期，清除存储并跳转到登录页
            console.log('Token expired, redirecting to login');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            delete api.defaults.headers.common.Authorization;
            navigate('/login');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // token解析失败，清除存储并跳转到登录页
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common.Authorization;
          navigate('/login');
        }
      } else {
        // 没有token，直接跳转到登录页
        navigate('/login');
      }
      setLoading(false);
    };

    initAuth();
  }, [navigate]);

  // 添加响应拦截器
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // 清除认证信息
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common.Authorization;
          setUser(null);
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login for user:', username);
      const response = await api.post<LoginResponse>('/auth/login', { username, password });
      console.log('Login response:', response);
      console.log('Response data:', response.data);

      const { accessToken, refreshToken, user } = response.data;
      console.log('Extracted tokens and user:', { accessToken, refreshToken, user });
      
      if (accessToken && refreshToken && user) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
        const userData = {
          id: user.userId || 0,
          username: user.username,
          email: ''
        };
        console.log('Setting user data:', userData);
        setUser(userData);
        
        console.log('Navigating to /channels after successful login');
        navigate('/channels');
        return { success: true, message: '登录成功' };
      }
      
      console.error('Login failed - Missing required data:', response.data);
      return { success: false, message: '登录失败：缺少必要的数据' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || '登录失败，请重试' 
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
      
      // 检查响应状态码和成功标志
      if (response.data?.success && response.data?.code === 201) {
        console.log('Registration successful, preparing to navigate');
        // 使用 Promise 来确保导航完成
        return new Promise<{ success: boolean; message: string }>((resolve) => {
          // 先返回成功状态
          resolve({ 
            success: true, 
            message: response.data.message || '注册成功' 
          });
          
          // 然后执行导航
          setTimeout(() => {
            console.log('Navigating to login page');
            navigate('/login', { replace: true });
          }, 1000);
        });
      }
      
      console.error('Registration failed - Invalid response:', response);
      return { 
        success: false, 
        message: response.data.message || '注册失败' 
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
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 