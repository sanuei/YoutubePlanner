import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { channelsApi, categoriesApi, Channel, Category } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// 图标组件
const ChannelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9z" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const ChannelList: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy] = useState('created_at');
  const [order] = useState<'asc' | 'desc'>('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [editChannel, setEditChannel] = useState<Channel | null>(null);
  const [channelName, setChannelName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await channelsApi.getList({
        search: debouncedSearch,
        sort_by: sortBy,
        order,
      });
      
      if (response.success) {
        setChannels(response.data.items);
      } else {
        enqueueSnackbar(response.message || '获取频道列表失败', { variant: 'error' });
        setChannels([]);
      }
    } catch (error) {
      console.error('获取频道列表失败:', error);
      enqueueSnackbar('获取频道列表失败', { variant: 'error' });
      setChannels([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, order, enqueueSnackbar]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getList({
        limit: 100,
      });
      
      if (response.success) {
        setCategories(response.data.items);
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
    fetchCategories();
  }, [fetchChannels, fetchCategories]);

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      enqueueSnackbar('请输入频道名称', { variant: 'warning' });
      return;
    }
    
    try {
      await channelsApi.create(channelName, user?.id);
      enqueueSnackbar('创建频道成功', { variant: 'success' });
      setOpenDialog(false);
      setChannelName('');
      fetchChannels();
    } catch (error) {
      console.error('创建频道失败:', error);
      enqueueSnackbar('创建频道失败', { variant: 'error' });
    }
  };

  const handleUpdateChannel = async () => {
    if (!editChannel || !channelName.trim()) {
      enqueueSnackbar('请输入频道名称', { variant: 'warning' });
      return;
    }
    
    try {
      await channelsApi.update(editChannel.channel_id, channelName);
      enqueueSnackbar('更新频道成功', { variant: 'success' });
      setOpenDialog(false);
      setEditChannel(null);
      setChannelName('');
      fetchChannels();
    } catch (error) {
      console.error('更新频道失败:', error);
      enqueueSnackbar('更新频道失败', { variant: 'error' });
    }
  };

  const handleDeleteChannels = async () => {
    if (!window.confirm('确定要删除选中的频道吗？')) return;
    
    try {
      await Promise.all(selectedChannels.map(id => channelsApi.delete(id)));
      enqueueSnackbar('删除频道成功', { variant: 'success' });
      setSelectedChannels([]);
      fetchChannels();
    } catch (error) {
      console.error('删除频道失败:', error);
      enqueueSnackbar('删除频道失败', { variant: 'error' });
    }
  };

  const handleOpenDialog = (channel?: Channel) => {
    if (channel) {
      setEditChannel(channel);
      setChannelName(channel.channel_name);
    } else {
      setEditChannel(null);
      setChannelName('');
    }
    setOpenDialog(true);
  };

  const handleChannelSelect = (channelId: number) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // 获取频道的分类列表
  const getChannelCategories = (channelId: number) => {
    return categories.filter(category => 
      category.user_id === user?.id
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                频道管理
              </h1>
              <p className="text-xl text-gray-600">
                管理您的YouTube频道，统一管理内容创作
              </p>
            </div>
            
            {selectedChannels.length > 0 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDeleteChannels}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <DeleteIcon />
                  <span className="ml-2">删除 ({selectedChannels.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和操作栏 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="搜索频道..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
            
            <button
              onClick={() => handleOpenDialog()}
              className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              <AddIcon />
              <span className="ml-2">创建频道</span>
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-right">
            共 {channels.length} 个频道
          </div>
        </div>

        {/* 频道网格 */}
        {channels.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChannelIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无频道</h3>
            <p className="text-gray-500 mb-6">创建您的第一个频道来开始管理内容</p>
            <button
              onClick={() => handleOpenDialog()}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <AddIcon />
              <span className="ml-2">创建频道</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {channels.map((channel) => {
              const channelCategories = getChannelCategories(channel.channel_id);
              return (
                <div
                  key={channel.channel_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenDialog(channel)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedChannels.includes(channel.channel_id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleChannelSelect(channel.channel_id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        aria-label={`选择频道 ${channel.channel_name}`}
                      />
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                        <ChannelIcon />
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(channel);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label={`编辑频道 ${channel.channel_name}`}
                    >
                      <EditIcon />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {channel.channel_name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {channelCategories.length} 个分类
                    </span>
                    {channel.scripts_count !== undefined && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {channel.scripts_count} 个脚本
                      </span>
                    )}
                  </div>

                  {channelCategories.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">相关分类：</h4>
                      {channelCategories.slice(0, 3).map((category) => (
                        <div
                          key={category.category_id}
                          className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50"
                        >
                          <CategoryIcon />
                          <span className="text-sm text-gray-600 truncate">{category.category_name}</span>
                        </div>
                      ))}
                      {channelCategories.length > 3 && (
                        <p className="text-xs text-gray-500 pl-6">
                          还有 {channelCategories.length - 3} 个分类...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 创建/编辑对话框 */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editChannel ? '编辑频道' : '创建频道'}
              </h3>
              <button
                onClick={() => setOpenDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="关闭对话框"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                频道名称
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="请输入频道名称"
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setOpenDialog(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={editChannel ? handleUpdateChannel : handleCreateChannel}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                {editChannel ? '更新' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelList; 