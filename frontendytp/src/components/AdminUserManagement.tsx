import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { adminUsersApi, AdminUser, AdminUpdateUserRequest } from '../services/api';
import { format } from 'date-fns';

// 图标组件
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AdminIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

const AdminUserManagement: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // 分页和筛选状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // 编辑表单状态
  const [editFormData, setEditFormData] = useState<AdminUpdateUserRequest>({
    email: '',
    displayName: '',
    role: '',
  });

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // 搜索时重置到第一页
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchTerm,
        sortBy,
        order,
      };

      const response = await adminUsersApi.getAllUsers(params);
      
      if (response.success && response.data) {
        const items = response.data.items || [];
        setUsers(items);
        
        if (response.data.pagination) {
          const paginationData = response.data.pagination;
          setTotalCount(paginationData.total || 0);
          setTotalPages(paginationData.pages || 1);
        }
      } else {
        enqueueSnackbar(response.message || '获取用户列表失败', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      enqueueSnackbar(error.message || '获取用户列表失败', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearchTerm, sortBy, order, enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleEditUser = (user: AdminUser) => {
    setCurrentUser(user);
    setEditFormData({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentUser) return;

    try {
      const response = await adminUsersApi.updateUser(currentUser.userId, editFormData);
      if (response.success) {
        enqueueSnackbar('用户信息更新成功', { variant: 'success' });
        setEditDialogOpen(false);
        fetchUsers();
      } else {
        enqueueSnackbar(response.message || '更新用户信息失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '更新用户信息失败', { variant: 'error' });
    }
  };

  const handleDeleteUser = (user: AdminUser) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!currentUser) return;

    try {
      const response = await adminUsersApi.deleteUser(currentUser.userId);
      if (response.success) {
        enqueueSnackbar('用户删除成功', { variant: 'success' });
        setDeleteDialogOpen(false);
        fetchUsers();
      } else {
        enqueueSnackbar(response.message || '删除用户失败', { variant: 'error' });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || '删除用户失败', { variant: 'error' });
    }
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // 如果点击的是当前排序字段，则切换排序方向
      const newOrder = order === 'asc' ? 'desc' : 'asc';
      setOrder(newOrder);
    } else {
      // 如果是新的排序字段，默认使用降序
      setSortBy(newSortBy);
      setOrder('desc');
    }
    
    setCurrentPage(1);
  };

  // 分页组件
  const Pagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
                 <button
           onClick={() => handlePageChange(currentPage - 1)}
           disabled={currentPage === 1}
           className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
           title="上一页"
           aria-label="上一页"
         >
           <ChevronLeftIcon />
         </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              page === currentPage
                ? 'bg-orange-500 text-white border-orange-500'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
        
                 <button
           onClick={() => handlePageChange(currentPage + 1)}
           disabled={currentPage === totalPages}
           className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
           title="下一页"
           aria-label="下一页"
         >
           <ChevronRightIcon />
         </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              用户管理
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              管理系统用户，查看用户信息和统计数据
            </p>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
              {loading && searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-xl p-1">
                {[
                  { value: 'createdAt', label: '创建时间' },
                  { value: 'updatedAt', label: '最后修改' },
                  { value: 'username', label: '用户名' },
                  { value: 'role', label: '角色' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === option.value
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <span className="ml-1">
                        {order === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-right">
            共 {totalCount || 0} 个用户
          </div>
        </div>

        {/* 加载状态 */}
        {loading && users.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* 用户卡片网格 */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.userId}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                {/* 用户头像和基本信息 */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.displayName || user.username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                  </div>
                </div>

                {/* 角色标签 */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'ADMIN' ? <AdminIcon /> : <UserIcon />}
                    <span className="ml-1">{user.role === 'ADMIN' ? '管理员' : '普通用户'}</span>
                  </span>
                </div>

                {/* 用户信息 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{format(new Date(user.createdAt), 'yyyy-MM-dd')}</span>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{user.stats?.total_scripts || 0}</div>
                    <div className="text-xs text-gray-500">脚本</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{user.stats?.total_channels || 0}</div>
                    <div className="text-xs text-gray-500">频道</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{user.stats?.total_categories || 0}</div>
                    <div className="text-xs text-gray-500">分类</div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <EditIcon />
                    <span className="ml-1 text-sm">编辑</span>
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <DeleteIcon />
                    <span className="ml-1 text-sm">删除</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && users.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无用户</h3>
            <p className="text-gray-500">系统中还没有用户数据</p>
          </div>
        )}

        {/* 分页 */}
        <Pagination />
      </div>

      {/* 编辑用户对话框 */}
      {editDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">编辑用户信息</h3>
              <button
                onClick={() => setEditDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="关闭对话框"
                aria-label="关闭对话框"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                                <input
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="请输入邮箱地址"
                  title="邮箱地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">显示名称</label>
                <input
                  type="text"
              value={editFormData.displayName}
              onChange={(e) => setEditFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="请输入显示名称"
                  title="显示名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">用户角色</label>
                <select
                value={editFormData.role}
                onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  title="用户角色"
                >
                  <option value="USER">普通用户</option>
                  <option value="ADMIN">管理员</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditDialogOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">确认删除</h3>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="关闭对话框"
                aria-label="关闭对话框"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-800 font-medium">
                    您确定要删除用户 "{currentUser?.username}" 吗？
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                删除用户将会同时删除该用户的所有数据，包括脚本、频道和分类等。此操作不可撤销。
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteUser}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement; 