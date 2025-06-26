/*
 * 创建日期: 2024-03-21
 * 文件说明: 影片脚本编辑页面组件，提供脚本的创建和编辑功能
 * 作者: Yann
 * 模块: components
 * 版本: 2.0
 * 修改记录:
 * - 2024-03-21 Yann 创建初始版本
 * - 2024-12-XX Yann 合并创建和编辑功能，添加自动保存，采用Notion风格设计
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { scriptsApi, channelsApi, categoriesApi, Script, Chapter } from '../services/api';

// 添加字数统计函数
const calculateWordCount = (chapters: Chapter[]): number => {
  let count = 0;
  if (chapters) {
    chapters.forEach(chapter => {
      if (chapter.content) {
        // 移除HTML标签和特殊字符，只保留中英文
        const text = chapter.content.replace(/<[^>]+>/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
        count += text.length;
      }
    });
  }
  return count;
};

// 渲染星级函数
const renderStars = (difficulty: number, onClick?: (value: number) => void) => {
  return (
    <Stack direction="row" spacing={0.5}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          onClick={() => onClick && onClick(star)}
          sx={{
            color: star <= difficulty ? 'warning.main' : 'action.disabled',
            fontSize: '1.5rem',
            cursor: onClick ? 'pointer' : 'default',
            '&:hover': onClick ? {
              color: 'warning.light',
            } : {}
          }}
        />
      ))}
    </Stack>
  );
};

const ScriptEdit: React.FC = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // 判断是否为创建模式
  const isCreateMode = !scriptId || scriptId === 'create';
  
  // 处理从思维导图传递的数据
  const mindMapData = location.state as { 
    title?: string; 
    alternativeTitle1?: string;
    alternativeTitle2?: string;
    description?: string;
    content?: string; 
    chapters?: Chapter[];
    rawContent?: string;
    fromMindMap?: boolean;
    mindMapId?: number;
    mindMapTitle?: string;
  } | null;
  
  const [formData, setFormData] = useState<Partial<Script>>(() => {
    const baseData = {
      title: '',
      alternative_title1: '',
      alternative_title2: '',
      description: '',
      difficulty: 1,
      status: 'Scripting' as const,
      channel_id: undefined,
      category_id: undefined,
      chapters: [{ chapter_number: 1, title: '', content: '' }],
    };

    // 如果是从思维导图传递的数据，则使用传递的数据
    if (mindMapData?.fromMindMap && isCreateMode) {
      console.log('=== ScriptEdit 接收到思维导图数据 ===');
      console.log('mindMapData:', mindMapData);
      
      const result = {
        ...baseData,
        title: mindMapData.title || '',
        alternative_title1: mindMapData.alternativeTitle1 || '',
        alternative_title2: mindMapData.alternativeTitle2 || '',
        description: mindMapData.description || '',
        chapters: mindMapData.chapters && mindMapData.chapters.length > 0 
          ? mindMapData.chapters 
          : [{ 
              chapter_number: 1, 
              title: '脚本内容', 
              content: mindMapData.content || mindMapData.rawContent || '' 
            }],
      };
      
      console.log('初始化后的formData:', result);
      console.log('章节数据:', result.chapters);
      
      return result;
    }

    return baseData;
  });

  // 添加字数统计状态
  const [wordCount, setWordCount] = useState(0);
  
  // 自动保存相关
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(0);
  const formDataRef = useRef(formData);

  // 更新formDataRef
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // 自动保存函数
  const autoSave = useCallback(async () => {
    if (isCreateMode || !hasChanges || saving) return;
    
    try {
      setSaving(true);
      const submitData = {
        ...formDataRef.current,
        title: formDataRef.current.title || '',
        description: formDataRef.current.description || '',
        difficulty: formDataRef.current.difficulty || 1,
        status: formDataRef.current.status || 'Scripting',
        category_id: formDataRef.current.category_id || undefined,
        chapters: formDataRef.current.chapters || [],
      };
      
      const response = await scriptsApi.update(Number(scriptId), submitData);
      if (response.success) {
        setLastSaved(new Date());
        setHasChanges(false);
        lastSaveTimeRef.current = Date.now();
      }
    } catch (error) {
      console.error('Auto save failed:', error);
      enqueueSnackbar('自动保存失败', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  }, [isCreateMode, hasChanges, saving, scriptId, enqueueSnackbar]);

  // 防抖保存：用户停止输入10秒后保存
  const debouncedSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (!isCreateMode && hasChanges) {
      debounceTimerRef.current = setTimeout(() => {
        autoSave();
      }, 10000); // 10秒防抖
    }
  }, [autoSave, isCreateMode, hasChanges]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!isCreateMode) {
          // 编辑模式：获取脚本详情
          const scriptResponse = await scriptsApi.getDetail(Number(scriptId));
          
          if (!scriptResponse.success) {
            throw new Error(scriptResponse.message || '获取脚本详情失败');
          }
          
          // 确保设置默认值
          setFormData({
            ...scriptResponse.data,
            difficulty: scriptResponse.data.difficulty || 1,
            status: scriptResponse.data.status || 'Scripting',
          });
          setLastSaved(new Date());
        }
        
        // 获取频道和分类数据
        try {
          const channelsResponse = await channelsApi.getList({});
          if (channelsResponse.success) {
            setChannels(channelsResponse.data.items);
          }
        } catch (error) {
          console.error('Error fetching channels:', error);
          enqueueSnackbar('获取频道列表失败，但您可以继续操作', { 
            variant: 'warning',
            autoHideDuration: 5000,
          });
        }

        try {
          const categoriesResponse = await categoriesApi.getList({});
          if (categoriesResponse.success) {
            setCategories(categoriesResponse.data.items);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          enqueueSnackbar('获取分类列表失败，但您可以继续操作', { 
            variant: 'warning',
            autoHideDuration: 5000,
          });
        }
      } catch (error: any) {
        console.error('Error in ScriptEdit:', error);
        setError(error.message || '获取数据失败');
        enqueueSnackbar(error.message || '获取数据失败', { 
          variant: 'error',
          autoHideDuration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scriptId, navigate, enqueueSnackbar, isCreateMode]);

  // 更新字数统计
  useEffect(() => {
    setWordCount(calculateWordCount(formData.chapters || []));
  }, [formData.chapters]);

  // 监听表单变化，触发自动保存
  useEffect(() => {
    if (!loading && !isCreateMode) {
      setHasChanges(true);
      // 触发防抖保存（用户停止输入10秒后保存）
      debouncedSave();
    }
  }, [formData, loading, isCreateMode, debouncedSave]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const submitData = {
        ...formData,
        title: formData.title || '',
        description: formData.description || '',
        difficulty: formData.difficulty || 1,
        status: formData.status || 'Scripting',
        category_id: formData.category_id || undefined,
        chapters: formData.chapters || [],
      };
      
      let response;
      if (isCreateMode) {
        response = await scriptsApi.create(submitData);
      } else {
        response = await scriptsApi.update(Number(scriptId), submitData);
      }
      
      if (response.success) {
        enqueueSnackbar(isCreateMode ? '脚本创建成功' : '脚本更新成功', { variant: 'success' });
        setHasChanges(false);
        setLastSaved(new Date());
        navigate('/scripts');
      } else {
        enqueueSnackbar(response.message || (isCreateMode ? '创建脚本失败' : '更新脚本失败'), { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Error saving script:', error);
      enqueueSnackbar(error.message || (isCreateMode ? '创建脚本失败' : '更新脚本失败'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addChapter = () => {
    setFormData(prev => {
      const currentChapters = prev.chapters || [];
      const newChapter = {
        chapter_number: currentChapters.length + 1,
        title: '',
        content: '',
      };
      return {
        ...prev,
        chapters: [...currentChapters, newChapter],
      };
    });
  };

  const removeChapter = (index: number) => {
    setFormData(prev => {
      const newChapters = prev.chapters?.filter((_, i) => i !== index) || [];
      // 重新排序章节编号
      const reorderedChapters = newChapters.map((chapter, i) => ({
        ...chapter,
        chapter_number: i + 1,
      }));
      return {
        ...prev,
        chapters: reorderedChapters,
      };
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/scripts')} size="large">
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/scripts')}
            sx={{ 
              mt: 2,
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            返回脚本列表
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafafa'
    }}>
      {/* 顶部导航栏 */}
      <Box sx={{ 
        backgroundColor: 'transparent', 
        width: '100%'
      }}>
        <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate('/scripts')} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight="500">
                {isCreateMode ? '新建脚本' : '编辑脚本'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isCreateMode && (
                <>
                  {saving && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      自动保存中...
                    </Typography>
                  )}
                  {lastSaved && !hasChanges && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`已保存 ${lastSaved.toLocaleTimeString()}`}
                      color="success"
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                  {hasChanges && !saving && (
                    <Chip
                      label="未保存"
                      color="warning"
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </>
              )}
              {!isCreateMode && (
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(`/scripts/${scriptId}/preview`)}
                  size="medium"
                  sx={{ textTransform: 'none' }}
                >
                  预览
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={saving || !formData.title || (formData.chapters?.some(chapter => !chapter.content))}
                startIcon={<SaveIcon />}
                size="medium"
                sx={{ 
                  textTransform: 'none',
                  color: 'white',
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                {isCreateMode ? '创建' : '保存'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

                    {/* 主内容区域 */}
       <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 4, pb: 6 }}>
         {/* 基本信息卡片 - 包含标题、备选标题、属性和描述 */}
         <Card sx={{ 
           mb: 4, 
           border: '1px solid #e0e0e0', 
           boxShadow: 'none',
           '&:hover': {
             transform: 'none',
             boxShadow: 'none'
           }
         }}>
           <CardContent sx={{ p: 4, pl: 6 }}>
             {/* 标题 */}
             <TextField
               placeholder="无标题"
               value={formData.title}
               onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
               variant="standard"
               fullWidth
               multiline
               InputProps={{
                 disableUnderline: true,
                 sx: {
                   fontSize: '2.5rem',
                   fontWeight: 'bold',
                   '& textarea': {
                     padding: 0,
                     resize: 'none',
                     lineHeight: 1.2,
                     '&::placeholder': {
                       color: '#d0d0d0',
                       opacity: 1,
                     }
                   }
                 }
               }}
               sx={{ mb: 3 }}
             />

             {/* 备选标题1 */}
             <TextField
               placeholder="备选标题1"
               value={formData.alternative_title1}
               onChange={(e) => setFormData(prev => ({ ...prev, alternative_title1: e.target.value }))}
               variant="standard"
               fullWidth
               multiline
               InputProps={{
                 disableUnderline: true,
                 sx: {
                   fontSize: '1.2rem',
                   color: 'text.secondary',
                   '& textarea': {
                     padding: 0,
                     resize: 'none',
                     lineHeight: 1.4,
                     '&::placeholder': {
                       color: '#d0d0d0',
                       opacity: 1,
                     }
                   }
                 }
               }}
               sx={{ mb: 2 }}
             />

             {/* 备选标题2 */}
             <TextField
               placeholder="备选标题2"
               value={formData.alternative_title2}
               onChange={(e) => setFormData(prev => ({ ...prev, alternative_title2: e.target.value }))}
               variant="standard"
               fullWidth
               multiline
               InputProps={{
                 disableUnderline: true,
                 sx: {
                   fontSize: '1.2rem',
                   color: 'text.secondary',
                   '& textarea': {
                     padding: 0,
                     resize: 'none',
                     lineHeight: 1.4,
                     '&::placeholder': {
                       color: '#d0d0d0',
                       opacity: 1,
                     }
                   }
                 }
               }}
               sx={{ mb: 4 }}
             />

             <Divider sx={{ mb: 4 }} />

             {/* 属性 */}
             <Box sx={{ mb: 4, ml: -2 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                 <SettingsIcon sx={{ mr: 1, color: 'text.secondary' }} />
                 <Typography variant="h6" sx={{ fontWeight: 500 }}>
                   属性
                 </Typography>
               </Box>
               
               <Stack spacing={3}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                   <Typography variant="body2" sx={{ minWidth: 80, color: 'text.secondary' }}>
                     状态
                   </Typography>
                   <FormControl size="small" sx={{ minWidth: 150 }}>
                     <Select
                       value={formData.status || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value || undefined }))}
                       displayEmpty
                     >
                       <MenuItem value="">未设置</MenuItem>
                       <MenuItem value="Scripting">编写中</MenuItem>
                       <MenuItem value="Reviewing">审核中</MenuItem>
                       <MenuItem value="Completed">已完成</MenuItem>
                     </Select>
                   </FormControl>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                   <Typography variant="body2" sx={{ minWidth: 80, color: 'text.secondary' }}>
                     难度
                   </Typography>
                   {renderStars(formData.difficulty || 1, (value) => setFormData(prev => ({ ...prev, difficulty: value })))}
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                   <Typography variant="body2" sx={{ minWidth: 80, color: 'text.secondary' }}>
                     频道
                   </Typography>
                   <FormControl size="small" sx={{ minWidth: 200 }}>
                     <Select
                       value={formData.channel_id || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, channel_id: e.target.value ? Number(e.target.value) : undefined }))}
                       displayEmpty
                     >
                       <MenuItem value="">未设置</MenuItem>
                       {channels.map((channel) => (
                         <MenuItem key={channel.channel_id} value={channel.channel_id}>
                           {channel.channel_name}
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>
                 </Box>

                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                   <Typography variant="body2" sx={{ minWidth: 80, color: 'text.secondary' }}>
                     分类
                   </Typography>
                   <FormControl size="small" sx={{ minWidth: 200 }}>
                     <Select
                       value={formData.category_id || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : undefined }))}
                       displayEmpty
                     >
                       <MenuItem value="">未设置</MenuItem>
                       {categories.map((category) => (
                         <MenuItem key={category.category_id} value={category.category_id}>
                           {category.category_name}
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>
                 </Box>
               </Stack>
             </Box>

             <Divider sx={{ mb: 4 }} />

             {/* 描述 */}
             <Box sx={{ ml: -2 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                 <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                 <Typography variant="h6" sx={{ fontWeight: 500 }}>
                   描述
                 </Typography>
               </Box>
               <Box sx={{ ml: 2 }}>
                 <TextField
                   placeholder="添加描述..."
                   value={formData.description}
                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                   variant="standard"
                   fullWidth
                   multiline
                   minRows={3}
                   InputProps={{
                     disableUnderline: true,
                     sx: {
                       fontSize: '1rem',
                       lineHeight: 1.6,
                       '& textarea': {
                         padding: 0,
                         resize: 'none',
                         '&::placeholder': {
                           color: '#d0d0d0',
                           opacity: 1,
                         }
                       }
                     }
                   }}
                 />
               </Box>
             </Box>
           </CardContent>
         </Card>

                 {/* 章节区域 */}
         <Card sx={{ 
           border: '1px solid #e0e0e0', 
           boxShadow: 'none',
           '&:hover': {
             transform: 'none',
             boxShadow: 'none'
           }
         }}>
           <CardContent sx={{ p: 2.5, pl: 6, pb: 2 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, ml: -2 }}>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                 <ArticleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                 <Typography variant="h6" sx={{ fontWeight: 500 }}>
                   脚本内容
                 </Typography>
                 <Chip 
                   label={`${wordCount} 字`} 
                   size="small" 
                   variant="outlined" 
                   sx={{ ml: 2, fontSize: '0.75rem' }}
                 />
               </Box>
               <Button
                 startIcon={<AddCircleIcon />}
                 onClick={addChapter}
                 variant="outlined"
                 size="medium"
                 sx={{ textTransform: 'none' }}
               >
                 添加章节
               </Button>
             </Box>

             <Stack spacing={1}>
               {formData.chapters?.map((chapter, index) => (
                 <Box key={index}>
                   {index > 0 && <Divider sx={{ my: 1 }} />}
                   
                   {/* 章节标题行 - 将"第X章"和标题输入框放在一行 */}
                   <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1, ml: -2 }}>
                     <Typography variant="subtitle1" sx={{ 
                       fontWeight: 500, 
                       color: 'text.primary',
                       minWidth: '60px',
                       mt: 0.5,
                       flexShrink: 0
                     }}>
                       第 {chapter.chapter_number} 章
                     </Typography>
                     
                     <TextField
                       placeholder="章节标题"
                       value={chapter.title}
                       onChange={(e) => {
                         const newChapters = [...(formData.chapters || [])];
                         newChapters[index].title = e.target.value;
                         setFormData(prev => ({ ...prev, chapters: newChapters }));
                       }}
                       variant="standard"
                       fullWidth
                       multiline
                       InputProps={{
                         disableUnderline: true,
                         sx: {
                           fontSize: '1.1rem',
                           fontWeight: 'medium',
                           '& textarea': {
                             padding: 0,
                             resize: 'none',
                             lineHeight: 1.4,
                             overflow: 'hidden',
                             '&::placeholder': {
                               color: '#d0d0d0',
                               opacity: 1,
                             }
                           }
                         }
                       }}
                     />
                     
                     {formData.chapters && formData.chapters.length > 1 && (
                       <IconButton
                         color="error"
                         onClick={() => removeChapter(index)}
                         size="small"
                         sx={{ mt: -0.5, flexShrink: 0 }}
                       >
                         <RemoveCircleIcon />
                       </IconButton>
                     )}
                   </Box>
                   
                   {/* 章节内容 */}
                   <TextField
                     placeholder="开始编写章节内容..."
                     value={chapter.content}
                     onChange={(e) => {
                       const newChapters = [...(formData.chapters || [])];
                       newChapters[index].content = e.target.value;
                       setFormData(prev => ({ ...prev, chapters: newChapters }));
                     }}
                     variant="standard"
                     fullWidth
                     multiline
                     InputProps={{
                       disableUnderline: true,
                       sx: {
                         fontSize: '1rem',
                         lineHeight: 1.5,
                         '& textarea': {
                           padding: 0,
                           resize: 'none',
                           overflow: 'hidden',
                           '&::placeholder': {
                             color: '#d0d0d0',
                             opacity: 1,
                           }
                         }
                       }
                     }}
                   />
                 </Box>
               ))}
             </Stack>
           </CardContent>
         </Card>
      </Box>
    </Box>
  );
};

export default ScriptEdit; 