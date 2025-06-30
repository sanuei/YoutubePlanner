import React, { createContext, useContext, useState, useEffect, useCallback, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  userId?: number;
  username: string;
  email: string;
  role?: string;
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
  refreshUserInfo: () => Promise<void>;
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

      
      // 获取当前路径
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/' || currentPath === '/login' || currentPath === '/register' || currentPath === '/changelog';
      
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
          

          
          if (Date.now() < expirationTime) {
            // token未过期，设置请求头并获取完整用户信息
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            
            try {
              // 获取完整的用户信息（包括role）
              const userInfoResponse = await api.get('/users/me');
              if (userInfoResponse && userInfoResponse.data) {
                const userData = {
                  id: userInfoResponse.data.userId || tokenData.userId || tokenData.sub,
                  userId: userInfoResponse.data.userId,
                  username: userInfoResponse.data.username,
                  email: userInfoResponse.data.email || '',
                  role: userInfoResponse.data.role || 'USER'
                };

                startTransition(() => {
                  setUser(userData);
                  setLoading(false);
                });
              } else {
                // 如果获取用户信息失败，使用token中的基本信息
                const userData = {
                  id: tokenData.userId || tokenData.sub,
                  username: tokenData.username || tokenData.sub,
                  email: '',
                  role: 'USER'
                };

                startTransition(() => {
                  setUser(userData);
                  setLoading(false);
                });
              }
            } catch (userInfoError) {
              console.error('Failed to fetch user info on init:', userInfoError);
              // 如果获取用户信息失败，使用token中的基本信息
              const userData = {
                id: tokenData.userId || tokenData.sub,
                username: tokenData.username || tokenData.sub,
                email: '',
                role: 'USER'
              };

              startTransition(() => {
                setUser(userData);
                setLoading(false);
              });
            }
            

            
            // 如果用户已登录且在登录/注册页面，重定向到脚本管理页面
            if (currentPath === '/login' || currentPath === '/register') {
              startTransition(() => {
                navigate('/scripts');
              });
            }
          } else {
            // token已过期，尝试刷新token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const response = await api.post('/auth/refresh', { refreshToken });
                const { accessToken } = response.data.data;
                
                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                
                // 重新解析新token并获取完整用户信息
                const newTokenData = JSON.parse(atob(accessToken.split('.')[1]));
                
                try {
                  // 获取完整的用户信息（包括role）
                  const userInfoResponse = await api.get('/users/me');
                  if (userInfoResponse && userInfoResponse.data) {
                    const userData = {
                      id: userInfoResponse.data.userId || newTokenData.userId || newTokenData.sub,
                      userId: userInfoResponse.data.userId,
                      username: userInfoResponse.data.username,
                      email: userInfoResponse.data.email || '',
                      role: userInfoResponse.data.role || 'USER'
                    };

                    startTransition(() => {
                      setUser(userData);
                      setLoading(false);
                    });
                  } else {
                    // 如果获取用户信息失败，使用token中的基本信息
                    const userData = {
                      id: newTokenData.userId || newTokenData.sub,
                      username: newTokenData.username || newTokenData.sub,
                      email: '',
                      role: 'USER'
                    };

                    startTransition(() => {
                      setUser(userData);
                      setLoading(false);
                    });
                  }
                } catch (userInfoError) {
                  console.error('Failed to fetch user info after refresh:', userInfoError);
                  // 如果获取用户信息失败，使用token中的基本信息
                  const userData = {
                    id: newTokenData.userId || newTokenData.sub,
                    username: newTokenData.username || newTokenData.sub,
                    email: '',
                    role: 'USER'
                  };

                  startTransition(() => {
                    setUser(userData);
                    setLoading(false);
                  });
                }
                

              } catch (refreshError) {

                // 刷新失败，清除存储
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                delete api.defaults.headers.common.Authorization;
                
                if (!isPublicRoute) {
                  startTransition(() => {
                    navigate('/login');
                  });
                }
                setLoading(false);
              }
            } else {
              // 没有refresh token，清除存储
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              delete api.defaults.headers.common.Authorization;
              
              if (!isPublicRoute) {
                startTransition(() => {
                  navigate('/login');
                });
              }
              setLoading(false);
            }
          }
        } catch (error) {
          // token解析失败，清除存储
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common.Authorization;
          
          // 只有在非公共路由时才重定向到登录页
          if (!isPublicRoute) {
            startTransition(() => {
              navigate('/login');
            });
          }
          setLoading(false);
        }
      } else {
        // 没有token，只有在非公共路由时才重定向到登录页
        if (!isPublicRoute) {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  // 强制刷新用户信息的函数
  const refreshUserInfo = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const userInfoResponse = await api.get('/users/me');
      
      if (userInfoResponse && userInfoResponse.data) {
        const userData = {
          id: userInfoResponse.data.userId || 0,
          userId: userInfoResponse.data.userId,
          username: userInfoResponse.data.username,
          email: userInfoResponse.data.email || '',
          role: userInfoResponse.data.role || 'USER'
        };

        startTransition(() => {
          setUser(userData);
        });
      }
    } catch (error) {
      // 静默处理错误
    }
  }, []);

  // 响应拦截器已在 api.ts 中处理，这里不需要重复添加

  const login = async (username: string, password: string) => {
    try {
      
      const response = await api.post<LoginResponse>('/auth/login', { username, password });

      // 检查响应是否成功
      if (response.data && response.data.success && response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        if (accessToken && refreshToken && user) {
                  localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          
          // 获取完整的用户信息（包括role）
          try {
            const userInfoResponse = await api.get('/users/me');
            if (userInfoResponse && userInfoResponse.data) {
              const userData = {
                id: userInfoResponse.data.userId || user.userId || 0,
                userId: userInfoResponse.data.userId,
                username: userInfoResponse.data.username,
                email: userInfoResponse.data.email || '',
                role: userInfoResponse.data.role || 'USER'
              };
                              
                startTransition(() => {
                  setUser(userData);
                });
            } else {
              // 如果获取用户信息失败，使用基本信息
              const userData = {
                id: user.userId || 0,
                username: user.username,
                email: '',
                role: 'USER'
              };

              startTransition(() => {
                setUser(userData);
              });
            }
          } catch (userInfoError) {

            // 如果获取用户信息失败，使用基本信息
            const userData = {
              id: user.userId || 0,
              username: user.username,
              email: '',
              role: 'USER'
            };
            
            startTransition(() => {
              setUser(userData);
            });
          }
          

          startTransition(() => {
            navigate('/scripts');
          });
          return { success: true, message: '登录成功' };
        } else {
          return { success: false, message: '登录失败：服务器响应数据不完整' };
        }
      } else {
        return { success: false, message: response.data?.message || '登录失败：服务器响应格式错误' };
      }
    } catch (error: any) {
      
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
      const response = await api.post<ApiResponse<{ userId: number; username: string }>>('/auth/register', {
        username,
        password,
        email
      });
      
      // 检查响应状态码和成功标志 - 现在response是完整的axios响应对象
      if (response.data?.success && response.data?.code === 201) {
        
        // 延迟导航，让用户看到成功消息
        setTimeout(() => {
          startTransition(() => {
            navigate('/login', { replace: true });
          });
        }, 2000);
        
        return { 
          success: true, 
          message: response.data.message || '注册成功' 
        };
      }
      return { 
        success: false, 
        message: response.data?.message || '注册失败' 
      };
    } catch (error: any) {
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
    startTransition(() => {
      setUser(null);
      navigate('/');
    });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 