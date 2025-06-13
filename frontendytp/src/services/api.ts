import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
    console.log('Request interceptor - Token:', token);
    console.log('Request URL:', config.url);
    console.log('Full request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', config.headers);
    } else {
      console.warn('No token found for request:', config.url);
    }

    // 确保请求头中包含正确的 Content-Type
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('Response success:', {
      url: response.config.url,
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    // 对于登录请求的特殊处理
    if (response.config.url?.includes('/auth/login')) {
      console.log('Processing login response:', response.data);
      return response.data;
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
    console.error('Response error details:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message
    });

    const originalRequest = error.config;

    // 如果是401错误且不是刷新token的请求
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      console.log('Handling 401 error, attempting token refresh');
      
      if (isRefreshing) {
        console.log('Token refresh already in progress, queueing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            console.log('Retrying request with new token');
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('Refresh token available:', !!refreshToken);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token');
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data.data;
        
        console.log('Token refresh successful');
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
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
    const queryParams = {
      ...params,
      page: params.page?.toString(),
      limit: params.limit?.toString(),
      channel_id: params.channel_id?.toString(),
      category_id: params.category_id?.toString(),
      difficulty: params.difficulty?.toString(),
    };

    console.log('API Request params:', queryParams);
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
  stats: UserStats;
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
};

export default api; 