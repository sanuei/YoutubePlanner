import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Stack,
  Paper,
  Checkbox,
  InputAdornment,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { channelsApi, categoriesApi, Channel, Category } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  cursor: 'pointer',
}));

const CategoryLabel = ({ label }: { label: string }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 24,
      padding: '0 8px',
      borderRadius: '16px',
      backgroundColor: 'transparent',
      border: '1px solid',
      borderColor: 'primary.main',
      color: 'primary.main',
      fontSize: '0.75rem',
      fontWeight: 500,
      gap: 0.5,
    }}
  >
    <CategoryIcon sx={{ fontSize: '0.875rem' }} />
    {label}
  </Box>
);

const CategoryList = ({ categories }: { categories: Category[] }) => (
  <Box sx={{ mt: 1 }}>
    {categories.map((category) => (
      <Typography
        key={category.category_id}
        variant="body2"
        color="text.secondary"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          '&:not(:last-child)': {
            mb: 0.5
          }
        }}
      >
        <CategoryIcon sx={{ fontSize: '0.875rem' }} />
        {category.category_name}
      </Typography>
    ))}
  </Box>
);

const ChannelList: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [editChannel, setEditChannel] = useState<Channel | null>(null);
  const [channelName, setChannelName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await channelsApi.getList({
        search,
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
  }, [search, sortBy, order, enqueueSnackbar]);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="500">
          频道管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: 'none' }}
        >
          创建频道
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="搜索频道..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          {selectedChannels.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteChannels}
              sx={{ textTransform: 'none' }}
            >
              删除选中 ({selectedChannels.length})
            </Button>
          )}
        </Stack>
      </Paper>

      {channels.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'background.paper',
          borderRadius: 1
        }}>
          <Typography color="text.secondary">
            暂无频道数据
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
        }}>
          {channels.map((channel) => {
            const channelCategories = getChannelCategories(channel.channel_id);
            return (
              <StyledCard 
                key={channel.channel_id} 
                elevation={1}
                onClick={() => handleOpenDialog(channel)}
              >
                <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Checkbox
                      checked={selectedChannels.includes(channel.channel_id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleChannelSelect(channel.channel_id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {channel.channel_name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CategoryLabel label={`${channelCategories.length} 个分类`} />
                        {channel.scripts_count !== undefined && (
                          <Typography variant="body2" color="text.secondary">
                            脚本数量：{channel.scripts_count}
                          </Typography>
                        )}
                      </Stack>
                      {channelCategories.length > 0 && (
                        <CategoryList categories={channelCategories} />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            );
          })}
        </Box>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editChannel ? '编辑频道' : '创建频道'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="频道名称"
            fullWidth
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            取消
          </Button>
          <Button
            onClick={editChannel ? handleUpdateChannel : handleCreateChannel}
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            {editChannel ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ChannelList; 