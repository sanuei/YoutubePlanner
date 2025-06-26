import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Pagination,
  Stack,
  Skeleton,
  CardHeader,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Api as ApiIcon,
  Description as DescriptionIcon,
  YouTube as YouTubeIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  DataObject as DataObjectIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { usersApi, User, Script, Channel, Category, scriptsApi, channelsApi, categoriesApi, ApiConfigRequest } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ITEMS_PER_PAGE = 5;

const UserManagement: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [apiConfigDialogOpen, setApiConfigDialogOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
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

  const handlePageChange = (type: 'scripts' | 'channels' | 'categories', page: number) => {
    setCurrentPage(prev => ({
        ...prev,
      [type]: page,
    }));
      };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };



  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Skeleton variant="text" width={300} height={80} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width={400} height={30} sx={{ mx: 'auto', mt: 2 }} />
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 主要内容网格 */}
      <Grid container spacing={4}>
        {/* 用户资料卡片 - 左侧 */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card 
            sx={{ 
              height: 'fit-content', 
              borderRadius: 3,
              position: 'sticky',
              top: 24
            }}
          >
            <CardHeader
              title="个人资料"
              subheader={`注册时间: ${user?.created_at ? new Date(user.created_at).toLocaleDateString() : '未知'}`}
              action={
                <IconButton onClick={() => setEditMode(true)}>
                  <EditIcon />
                </IconButton>
              }
            />
            <CardContent>
              {/* 用户头像和基本信息 */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: 'success.main', 
                        borderRadius: '50%',
                        border: '2px solid white'
                      }} 
                    />
                  }
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '2.5rem',
                      boxShadow: 3
                    }}
                  >
                    {user?.display_name?.[0] || user?.username?.[0] || '😊'}
                  </Avatar>
                </Badge>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user?.display_name || user?.username}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mb: 2 }}>
                  <Chip 
                    label="活跃用户" 
                    color="success" 
                    variant="outlined"
                    size="small"
                  />
                  {user?.role === 'ADMIN' && (
                    <Chip 
                      label="管理员" 
                      color="warning" 
                      variant="filled"
                      size="small"
                    />
                  )}
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* 详细信息 */}
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    基本信息
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PersonIcon color="action" fontSize="small" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          用户名
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user?.username}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <EmailIcon color="action" fontSize="small" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          邮箱地址
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user?.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarIcon color="action" fontSize="small" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          注册时间
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '未知'}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* API配置状态 */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    API配置状态
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ApiIcon color="action" fontSize="small" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        API密钥
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user?.apiConfig?.hasApiKey ? '已配置' : '未配置'}
                      </Typography>
                    </Box>
                    <Chip 
                      label={user?.apiConfig?.hasApiKey ? '已配置' : '未配置'}
                      color={user?.apiConfig?.hasApiKey ? 'success' : 'warning'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

            {/* 操作按钮 */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  fullWidth
                  size="large"
                >
                  编辑资料
                </Button>
                
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Button
                      variant="outlined"
                      startIcon={<LockIcon />}
                    onClick={() => setPasswordDialogOpen(true)}
                      fullWidth
                      size="small"
                    >
                      修改密码
                    </Button>
                  </Grid>
                  <Grid size={6}>
                    <Button
                      variant="outlined"
                      startIcon={<ApiIcon />}
                    onClick={() => {
                      fetchApiConfig();
                      setApiConfigDialogOpen(true);
                    }}
                      fullWidth
                      size="small"
                    >
                      API配置
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 数据管理区域 - 右侧 */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3, height: 'fit-content' }}>
            <CardHeader
              title="数据管理"
              subheader="查看和管理您的内容数据"
              action={
                <Chip 
                  label="数据统计" 
                  color="primary" 
                  variant="outlined"
                />
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab 
                    icon={<DescriptionIcon />}
                    iconPosition="start"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        脚本管理
                        <Chip 
                          label={statsData.scripts.length}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                  <Tab 
                    icon={<YouTubeIcon />}
                    iconPosition="start"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        频道管理
                        <Chip 
                          label={statsData.channels.length}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                  <Tab 
                    icon={<CategoryIcon />}
                    iconPosition="start"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        分类管理
                        <Chip 
                          label={statsData.categories.length}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <DataPanel
                  title="脚本管理"
                  data={getCurrentPageData('scripts')}
                  totalPages={getTotalPages('scripts')}
                  currentPage={currentPage.scripts}
                  onPageChange={(page) => handlePageChange('scripts', page)}
                  renderItem={(item: Script) => (
                    <ListItem 
                      key={item.script_id}
                      sx={{ 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <Badge badgeContent={item.chapters_count || 0} color="primary">
                          <DescriptionIcon color="primary" />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip 
                                label={`${item.chapters_count || 0} 章节`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip 
                                label={item.status || '草稿'}
                                size="small"
                                color={item.status === '完成' ? 'success' : 'warning'}
                                variant="outlined"
                              />
                              <Chip 
                                label={`难度 ${item.difficulty || 1}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Stack>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <DataPanel
                  title="频道管理"
                  data={getCurrentPageData('channels')}
                  totalPages={getTotalPages('channels')}
                  currentPage={currentPage.channels}
                  onPageChange={(page) => handlePageChange('channels', page)}
                  renderItem={(item: Channel) => (
                    <ListItem 
                      key={item.channel_id}
                      sx={{ 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <Badge badgeContent={item.scripts_count || 0} color="error">
                          <YouTubeIcon color="error" />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.channel_name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip 
                                label={`${item.scripts_count || 0} 脚本`}
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                              <Chip 
                                label={new Date(item.created_at).toLocaleDateString()}
                                size="small"
                                variant="outlined"
                                icon={<CalendarIcon />}
                              />
                            </Stack>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <DataPanel
                  title="分类管理"
                  data={getCurrentPageData('categories')}
                  totalPages={getTotalPages('categories')}
                  currentPage={currentPage.categories}
                  onPageChange={(page) => handlePageChange('categories', page)}
                  renderItem={(item: Category) => (
                    <ListItem 
                      key={item.category_id}
                      sx={{ 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <CategoryIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.category_name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={new Date(item.created_at).toLocaleDateString()}
                              size="small"
                              variant="outlined"
                              icon={<CalendarIcon />}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 编辑资料对话框 */}
      <Dialog 
        open={editMode} 
        onClose={() => setEditMode(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EditIcon color="primary" />
            编辑个人资料
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              name="display_name"
              label="显示名称"
              value={formData.display_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="email"
              label="邮箱地址"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditMode(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            保存更改
          </Button>
        </DialogActions>
      </Dialog>

      {/* 修改密码对话框 */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LockIcon color="primary" />
            修改密码
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
                    name="current_password"
              label="当前密码"
              type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
                    name="new_password"
              label="新密码"
              type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
                    name="confirm_password"
              label="确认新密码"
              type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            取消
          </Button>
          <Button 
                onClick={handleChangePassword}
            variant="contained"
              >
                确认修改
          </Button>
        </DialogActions>
      </Dialog>

      {/* API配置对话框 */}
      <Dialog 
        open={apiConfigDialogOpen} 
        onClose={() => setApiConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ApiIcon color="primary" />
            大模型API配置
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>API提供商</InputLabel>
              <Select
                value={apiConfigData.apiProvider}
                onChange={(e) => handleApiProviderChange(e.target.value)}
                label="API提供商"
              >
                <MenuItem value="openai">OpenAI</MenuItem>
                <MenuItem value="claude">Claude</MenuItem>
                <MenuItem value="custom">第三方API</MenuItem>
              </Select>
            </FormControl>

            <TextField
                    name="apiKey"
              label="API密钥"
              type={showApiKey ? 'text' : 'password'}
                    value={apiConfigData.apiKey}
                    onChange={handleApiConfigChange}
              fullWidth
                    placeholder={user?.apiConfig?.hasApiKey ? '已配置API密钥' : '请输入您的API密钥'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                    onClick={() => setShowApiKey(!showApiKey)}
                      edge="end"
                    >
                      {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
                  name="apiBaseUrl"
              label="API基础URL"
                  value={apiConfigData.apiBaseUrl}
                  onChange={handleApiConfigChange}
              fullWidth
                  placeholder="https://api.openai.com/v1"
                />

            <TextField
                  name="apiModel"
              label="模型名称"
                  value={apiConfigData.apiModel}
                  onChange={handleApiConfigChange}
              fullWidth
                  placeholder="gpt-3.5-turbo"
                />

            <Paper sx={{ p: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Typography variant="subtitle2" gutterBottom>
                配置说明：
              </Typography>
              <Typography variant="body2" component="div">
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <li><strong>OpenAI:</strong> 官方API，URL: https://api.openai.com/v1</li>
                  <li><strong>Claude:</strong> Anthropic官方API</li>
                  <li><strong>第三方API:</strong> 如DeerAPI等，URL: https://api.deerapi.com/v1</li>
                </Box>
              </Typography>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setApiConfigDialogOpen(false)}>
            取消
          </Button>
          <Button 
                onClick={handleSaveApiConfig}
            variant="contained"
            startIcon={<SaveIcon />}
              >
                保存配置
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// 数据面板组件
interface DataPanelProps {
  title: string;
  data: any[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  renderItem: (item: any) => React.ReactNode;
}

const DataPanel: React.FC<DataPanelProps> = ({
  title,
  data,
  totalPages,
  currentPage,
  onPageChange,
  renderItem,
}) => {
  return (
    <Box>
      {data.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <DataObjectIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            暂无{title}数据
          </Typography>
          <Typography variant="body2" color="text.secondary">
            开始创建您的第一个内容吧
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              共 {data.length} 项数据
            </Typography>
          </Box>
          
          <Stack spacing={1}>
            {data.map(renderItem)}
          </Stack>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => onPageChange(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default UserManagement; 