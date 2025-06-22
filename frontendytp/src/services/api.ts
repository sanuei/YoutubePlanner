import axios from 'axios';
import { logger } from './logger';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    logger.log('Request URL:', config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      logger.warn('No token found for request:', config.url);
    }

    // 确保请求头中包含正确的 Content-Type
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对于认证相关请求的特殊处理 - 返回完整的响应对象
    if (response.config.url?.includes('/auth/login') || 
        response.config.url?.includes('/auth/register') || 
        response.config.url?.includes('/auth/refresh')) {
      return response;
    }

    // 如果响应成功，直接返回响应数据
    if (response.data && response.data.success) {
      return response.data;
    }

    // 如果响应成功但没有 success 字段，包装成标准格式
    return {
      success: true,
      code: response.status,
      message: '操作成功',
      data: response.data
    };
  },
  async (error) => {
    logger.error('Response error details:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    const originalRequest = error.config;

    // 如果是401错误且不是刷新token的请求
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      logger.log('Handling 401 error, attempting token refresh');
      
      if (isRefreshing) {
        logger.log('Token refresh already in progress, queueing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            logger.log('Retrying request with new token');
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No fresh token available');
        }

        logger.log('Attempting to refresh token');
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data.data;
        
        logger.log('Token refresh successful');
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        logger.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        // 清除所有认证信息
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common.Authorization;
        // 重定向到登录页面
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 处理其他错误
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);

// 频道相关接口
export interface Channel {
  channel_id: number;
  channel_name: string;
  user_id: number;
  created_at: string;
  scripts_count?: number;
}

// 脚本相关接口
export interface Chapter {
  chapter_number: number;
  title: string;
  content: string;
}

export interface Script {
  script_id: number;
  title: string;
  alternative_title1?: string;
  alternative_title2?: string;
  description?: string;
  difficulty?: number;
  status?: string;
  release_date?: string;
  channel_id?: number;
  category_id?: number;
  channel?: Channel | null;
  category?: Category | null;
  chapters: Chapter[];
  created_at: string;
  updated_at: string;
  chapters_count?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
  request_id: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationData;
}

export interface Category {
  category_id: number;
  category_name: string;
  user_id: number;
  created_at: string;
}

export interface ScriptListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
  channel_id?: string;
  category_id?: string;
  status?: string;
  difficulty?: string;
  include?: string;
}

export const channelsApi = {
  create: (channelName: string, userId?: number): Promise<ApiResponse<Channel>> => {
    return api.post('/channels', { 
      channel_name: channelName,
      user_id: userId
    });
  },

  getList: (params: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedData<Channel>>> => {
    return api.get('/channels', { params });
  },

  getDetail: (channelId: number): Promise<ApiResponse<Channel>> => {
    return api.get(`/channels/${channelId}`);
  },

  update: (channelId: number, channelName: string): Promise<ApiResponse<Channel>> => {
    return api.put(`/channels/${channelId}`, { channel_name: channelName });
  },

  delete: (channelId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/channels/${channelId}`);
  },
};

export const scriptsApi = {
  create: (script: Omit<Script, 'script_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Script>> => {
    return api.post('/scripts', script);
  },

  getList: (params: ScriptListParams): Promise<ApiResponse<PaginatedData<Script>>> => {
    const queryParams: any = {
      ...params,
      page: params.page?.toString(),
      limit: params.limit?.toString(),
      channel_id: params.channel_id && params.channel_id !== '' ? parseInt(params.channel_id) : undefined,
      category_id: params.category_id && params.category_id !== '' ? parseInt(params.category_id) : undefined,
      difficulty: params.difficulty && params.difficulty !== '' ? parseInt(params.difficulty) : undefined,
    };

    // 移除空值和undefined值
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === '' || queryParams[key] === null) {
        delete queryParams[key];
      }
    });

    console.log('API Request params (after processing):', queryParams);
    return api.get('/scripts', { params: queryParams });
  },

  getDetail: (scriptId: number): Promise<ApiResponse<Script>> => {
    return api.get(`/scripts/${scriptId}`);
  },

  update: (scriptId: number, script: Partial<Script>): Promise<ApiResponse<Script>> => {
    return api.put(`/scripts/${scriptId}`, script);
  },

  delete: (scriptId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/scripts/${scriptId}`);
  },
};

export const categoriesApi = {
  getList: (params: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedData<Category>>> => {
    return api.get('/categories', { params });
  },

  getDetail: (id: number): Promise<ApiResponse<Category>> => {
    return api.get(`/categories/${id}`);
  },

  create: (data: { category_name: string; user_id?: number }): Promise<ApiResponse<Category>> => {
    return api.post('/categories', data);
  },

  update: (id: number, data: { category_name: string; user_id?: number }): Promise<ApiResponse<Category>> => {
    return api.put(`/categories/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/categories/${id}`);
  },
};

// 用户相关接口
export interface UserStats {
  total_scripts: number;
  total_channels: number;
  total_categories: number;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  display_name: string;
  role?: string;
  stats: UserStats;
  apiConfig?: ApiConfig;
}

export interface UpdateUserData {
  email?: string;
  display_name?: string;
  avatar_url?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface ApiConfig {
  apiProvider?: string;
  apiBaseUrl?: string;
  apiModel?: string;
  hasApiKey?: boolean;
}

export interface ApiConfigRequest {
  apiProvider?: string;
  apiKey?: string;
  apiBaseUrl?: string;
  apiModel?: string;
}

// 管理员用户管理相关接口
export interface AdminUser {
  userId: number;
  username: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  stats?: UserStats;
}

export interface AdminUpdateUserRequest {
  email?: string;
  displayName?: string;
  role?: string;
}

export const usersApi = {
  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return api.get('/users/me');
  },

  updateCurrentUser: (data: UpdateUserData): Promise<ApiResponse<User>> => {
    return api.put('/users/me', data);
  },

  changePassword: (data: ChangePasswordData): Promise<ApiResponse<void>> => {
    return api.put('/users/me/password', data);
  },

  getApiConfig: (): Promise<ApiResponse<ApiConfig>> => {
    return api.get('/users/me/api-config');
  },

  updateApiConfig: (data: ApiConfigRequest): Promise<ApiResponse<ApiConfig>> => {
    return api.put('/users/me/api-config', data);
  },

  getFullApiConfig: (): Promise<ApiResponse<ApiConfigRequest>> => {
    return api.get('/users/me/api-config/full');
  },
};

// 管理员用户管理API
export const adminUsersApi = {
  getAllUsers: (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedData<AdminUser>>> => {
    return api.get('/admin/users', { params });
  },

  getUserById: (userId: number): Promise<ApiResponse<AdminUser>> => {
    return api.get(`/admin/users/${userId}`);
  },

  updateUser: (userId: number, data: AdminUpdateUserRequest): Promise<ApiResponse<AdminUser>> => {
    return api.put(`/admin/users/${userId}`, data);
  },

  deleteUser: (userId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/admin/users/${userId}`);
  },

  updateUserRole: (userId: number, role: string): Promise<ApiResponse<AdminUser>> => {
    return api.put(`/admin/users/${userId}/role`, null, { params: { role } });
  },
};

// 思维导图相关接口
export interface MindMapNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: any;
}

export interface MindMapRequest {
  title: string;
  description?: string;
  nodesData?: string; // JSON字符串
  edgesData?: string; // JSON字符串
}

export interface MindMapResponse {
  mindMapId: number;
  title: string;
  description?: string;
  nodesData?: string;
  edgesData?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MindMapListResponse {
  mindMapId: number;
  title: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// 思维导图API接口定义
export const mindMapsApi = {
  create: (data: MindMapRequest): Promise<ApiResponse<MindMapResponse>> => {
    return api.post('/mindmaps', data);
  },

  getById: (id: number): Promise<ApiResponse<MindMapResponse>> => {
    return api.get(`/mindmaps/${id}`);
  },

  update: (id: number, data: MindMapRequest): Promise<ApiResponse<MindMapResponse>> => {
    return api.put(`/mindmaps/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/mindmaps/${id}`);
  },

  getUserMindMaps: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
  }): Promise<ApiResponse<PaginatedData<MindMapListResponse>>> => {
    return api.get('/mindmaps', { params });
  },
};

export default api; 