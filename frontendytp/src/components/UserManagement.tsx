import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { usersApi, User, Script, Channel, Category, scriptsApi, channelsApi, categoriesApi, ApiConfigRequest } from '../services/api';

// 图标组件
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ApiIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DescriptionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ITEMS_PER_PAGE = 5;
const EMOJIS = ['😀', '😎', '🤖', '👨‍💻', '👩‍💻', '🎮', '🎯', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎬', '🎥', '📺', '🎙️', '🎤', '🎧', '🎼'];

const UserManagement: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [apiConfigDialogOpen, setApiConfigDialogOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    display_name: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [apiConfigData, setApiConfigData] = useState<ApiConfigRequest>({
    apiProvider: 'openai',
    apiKey: '',
    apiBaseUrl: 'https://api.openai.com/v1',
    apiModel: 'gpt-3.5-turbo',
  });
  const [statsData, setStatsData] = useState({
    scripts: [] as Script[],
    channels: [] as Channel[],
    categories: [] as Category[],
  });
  const [currentPage, setCurrentPage] = useState({
    scripts: 1,
    channels: 1,
    categories: 1,
  });

  const getRandomEmoji = () => {
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  };

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersApi.getCurrentUser();
      setUser(response.data);
      setFormData({
        email: response.data.email,
        display_name: response.data.display_name || response.data.username,
      });
      setError(null);
    } catch (err) {
      setError('获取用户信息失败');
      enqueueSnackbar('获取用户信息失败', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const fetchStatsData = useCallback(async () => {
    try {
      const [scriptsRes, channelsRes, categoriesRes] = await Promise.all([
        scriptsApi.getList({ limit: 100 }),
        channelsApi.getList({ limit: 100 }),
        categoriesApi.getList({ limit: 100 }),
      ]);

      setStatsData({
        scripts: scriptsRes.data.items,
        channels: channelsRes.data.items,
        categories: categoriesRes.data.items,
      });
    } catch (err) {
      enqueueSnackbar('获取统计数据失败', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const fetchApiConfig = useCallback(async () => {
    try {
      const response = await usersApi.getApiConfig();
      const config = response.data;
      setApiConfigData({
        apiProvider: config.apiProvider || 'openai',
        apiKey: '',
        apiBaseUrl: config.apiBaseUrl || 'https://api.openai.com/v1',
        apiModel: config.apiModel || 'gpt-3.5-turbo',
      });
    } catch (err) {
      console.error('获取API配置失败:', err);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchStatsData();
    fetchApiConfig();
  }, [fetchUserData, fetchStatsData, fetchApiConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApiConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiConfigData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApiProviderChange = (provider: string) => {
    let defaultUrl = '';
    let defaultModel = '';
    
    switch (provider) {
      case 'openai':
        defaultUrl = 'https://api.openai.com/v1';
        defaultModel = 'gpt-3.5-turbo';
        break;
      case 'claude':
        defaultUrl = 'https://api.anthropic.com/v1';
        defaultModel = 'claude-3-sonnet-20240229';
        break;
      case 'custom':
        defaultUrl = 'https://api.deerapi.com/v1';
        defaultModel = 'deepseek-chat';
        break;
    }
    
    setApiConfigData(prev => ({
      ...prev,
      apiProvider: provider,
      apiBaseUrl: defaultUrl,
      apiModel: defaultModel,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await usersApi.updateCurrentUser(formData);
      setUser(response.data);
      setEditMode(false);
      enqueueSnackbar('用户信息更新成功', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('更新用户信息失败', { variant: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      enqueueSnackbar('两次输入的密码不一致', { variant: 'error' });
      return;
    }

    try {
      await usersApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setPasswordDialogOpen(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      enqueueSnackbar('密码修改成功', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('密码修改失败', { variant: 'error' });
    }
  };

  const handleSaveApiConfig = async () => {
    try {
      await usersApi.updateApiConfig(apiConfigData);
      setApiConfigDialogOpen(false);
      enqueueSnackbar('API配置保存成功', { variant: 'success' });
      fetchUserData();
    } catch (err) {
      enqueueSnackbar('API配置保存失败', { variant: 'error' });
    }
  };

  const getCurrentPageData = (type: 'scripts' | 'channels' | 'categories') => {
    const startIndex = (currentPage[type] - 1) * ITEMS_PER_PAGE;
    return statsData[type].slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const getTotalPages = (type: 'scripts' | 'channels' | 'categories') => {
    return Math.ceil(statsData[type].length / ITEMS_PER_PAGE);
  };

  const handlePageChange = (type: 'scripts' | 'channels' | 'categories', direction: 'prev' | 'next') => {
    setCurrentPage(prev => {
      const current = prev[type];
      const total = getTotalPages(type);
      const newPage = direction === 'prev' ? current - 1 : current + 1;
      
      if (newPage < 1 || newPage > total) {
        return prev;
      }
      
      return {
        ...prev,
        [type]: newPage,
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              我的信息
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              管理您的个人资料和系统设置
            </p>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户资料卡片 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* 头像和基本信息 */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
                {getRandomEmoji()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user?.display_name || user?.username}
              </h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                活跃用户
              </div>
            </div>

            {/* 用户信息 */}
            <div className="lg:col-span-1">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">显示名称</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon />
                      </div>
                      <input
                        type="text"
                        name="display_name"
                        value={formData.display_name}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="请输入显示名称"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EmailIcon />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="请输入邮箱地址"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <UserIcon />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">用户名</p>
                      <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <EmailIcon />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">邮箱地址</p>
                      <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <UserIcon />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">显示名称</p>
                      <p className="text-lg font-semibold text-gray-900">{user?.display_name || '未设置'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                  >
                    <SaveIcon />
                    <span className="ml-2">保存更改</span>
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    取消
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                  >
                    <EditIcon />
                    <span className="ml-2">编辑资料</span>
                  </button>
                  <button
                    onClick={() => setPasswordDialogOpen(true)}
                    className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    <LockIcon />
                    <span className="ml-2">修改密码</span>
                  </button>
                  <button
                    onClick={() => {
                      fetchApiConfig();
                      setApiConfigDialogOpen(true);
                    }}
                    className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    <ApiIcon />
                    <span className="ml-2">API配置</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 数据统计 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">数据统计</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                key: 'scripts', 
                title: '脚本管理', 
                icon: <DescriptionIcon />, 
                color: 'bg-blue-500',
                data: statsData.scripts 
              },
              { 
                key: 'channels', 
                title: '频道管理', 
                icon: <YouTubeIcon />, 
                color: 'bg-red-500',
                data: statsData.channels 
              },
              { 
                key: 'categories', 
                title: '分类管理', 
                icon: <CategoryIcon />, 
                color: 'bg-green-500',
                data: statsData.categories 
              },
            ].map((stat) => (
              <div
                key={stat.key}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                      <p className="text-3xl font-bold text-gray-900">{stat.data.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getCurrentPageData(stat.key as 'scripts' | 'channels' | 'categories').map((item: any) => (
                      <div key={item.script_id || item.channel_id || item.category_id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-2 h-2 ${stat.color} rounded-full`}></div>
                        <span className="text-sm text-gray-700 truncate">
                          {item.title || item.channel_name || item.category_name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {getTotalPages(stat.key as 'scripts' | 'channels' | 'categories') > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                                             <button 
                         onClick={() => handlePageChange(stat.key as 'scripts' | 'channels' | 'categories', 'prev')}
                         disabled={currentPage[stat.key as 'scripts' | 'channels' | 'categories'] === 1}
                         className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                         title="上一页"
                         aria-label="上一页"
                       >
                         <ChevronLeftIcon />
                       </button>
                       <span className="text-sm text-gray-600">
                         {currentPage[stat.key as 'scripts' | 'channels' | 'categories']} / {getTotalPages(stat.key as 'scripts' | 'channels' | 'categories')}
                       </span>
                       <button 
                         onClick={() => handlePageChange(stat.key as 'scripts' | 'channels' | 'categories', 'next')}
                         disabled={currentPage[stat.key as 'scripts' | 'channels' | 'categories'] === getTotalPages(stat.key as 'scripts' | 'channels' | 'categories')}
                         className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                         title="下一页"
                         aria-label="下一页"
                       >
                         <ChevronRightIcon />
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 修改密码对话框 */}
      {passwordDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <LockIcon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">修改密码</h3>
              </div>
                             <button
                 onClick={() => setPasswordDialogOpen(false)}
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                 title="关闭对话框"
                 aria-label="关闭对话框"
               >
                 <CloseIcon />
               </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="请输入当前密码"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="请输入新密码"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setPasswordDialogOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API配置对话框 */}
      {apiConfigDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ApiIcon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">大模型API配置</h3>
              </div>
                             <button
                 onClick={() => setApiConfigDialogOpen(false)}
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                 title="关闭对话框"
                 aria-label="关闭对话框"
               >
                 <CloseIcon />
               </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API提供商</label>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {[
                    { value: 'openai', label: 'OpenAI' },
                    { value: 'claude', label: 'Claude' },
                    { value: 'custom', label: '第三方API' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleApiProviderChange(option.value)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        apiConfigData.apiProvider === option.value
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API密钥</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    name="apiKey"
                    value={apiConfigData.apiKey}
                    onChange={handleApiConfigChange}
                    className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder={user?.apiConfig?.hasApiKey ? '已配置API密钥' : '请输入您的API密钥'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API基础URL</label>
                <input
                  type="text"
                  name="apiBaseUrl"
                  value={apiConfigData.apiBaseUrl}
                  onChange={handleApiConfigChange}
                  className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="https://api.openai.com/v1"
                />
                {apiConfigData.apiProvider === 'custom' && (
                  <p className="text-sm text-gray-500 mt-1">
                    对于DeerAPI，请使用: https://api.deerapi.com/v1
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">模型名称</label>
                <input
                  type="text"
                  name="apiModel"
                  value={apiConfigData.apiModel}
                  onChange={handleApiConfigChange}
                  className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="gpt-3.5-turbo"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">配置说明：</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <strong>OpenAI:</strong> 官方API，URL: https://api.openai.com/v1</p>
                  <p>• <strong>Claude:</strong> Anthropic官方API</p>
                  <p>• <strong>第三方API:</strong> 如DeerAPI等，URL: https://api.deerapi.com/v1</p>
                  <p className="mt-2"><strong>DeerAPI配置示例：</strong></p>
                  <p>• API密钥：从DeerAPI获取的密钥</p>
                  <p>• 基础URL：https://api.deerapi.com/v1</p>
                  <p>• 模型：deepseek-chat, gpt-4, claude-3等</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setApiConfigDialogOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSaveApiConfig}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 