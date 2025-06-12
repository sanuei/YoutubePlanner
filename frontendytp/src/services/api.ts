import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': '1'
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.params || config.data);
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data);
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
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
  create: (channelName: string): Promise<ApiResponse<Channel>> => {
    return api.post('/channels', { channel_name: channelName });
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

export default api; 