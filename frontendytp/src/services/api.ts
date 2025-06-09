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
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
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

export default api; 