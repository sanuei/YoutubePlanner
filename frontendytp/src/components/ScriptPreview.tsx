import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Slider,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Star as StarIcon,
  AutoStories as AutoStoriesIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { scriptsApi, Script } from '../services/api';
import { format } from 'date-fns';

const ScriptPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTeleprompterMode, setIsTeleprompterMode] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(50);
  const [isScrolling, setIsScrolling] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchScript = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await scriptsApi.getDetail(parseInt(id));
        if (response.success) {
          setScript(response.data);
        } else {
          enqueueSnackbar(response.message || '获取脚本详情失败', { variant: 'error' });
        }
      } catch (error: any) {
        enqueueSnackbar(error.message || '获取脚本详情失败', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [id, enqueueSnackbar]);

  // 渲染星级
  const renderStars = (difficulty: number) => {
    return (
      <Stack direction="row" spacing={0.5}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            sx={{
              color: star <= difficulty ? 'warning.main' : 'action.disabled',
              fontSize: '1.2rem',
            }}
          />
        ))}
      </Stack>
    );
  };

  const handleTeleprompterToggle = () => {
    setIsTeleprompterMode(!isTeleprompterMode);
    if (isScrolling) {
      stopScrolling();
    }
  };

  const handleScrollSpeedChange = (event: Event, newValue: number | number[]) => {
    setScrollSpeed(newValue as number);
    if (isScrolling) {
      stopScrolling();
      startScrolling();
    }
  };

  const startScrolling = () => {
    if (!contentRef.current) return;
    
    setIsScrolling(true);
    const speed = 100 - scrollSpeed; // 反转速度值，使滑块向右时速度更快
    const scrollAmount = 1;
    
    scrollInterval.current = setInterval(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop += scrollAmount;
        
        // 检查是否滚动到底部
        if (contentRef.current.scrollTop + contentRef.current.clientHeight >= contentRef.current.scrollHeight) {
          stopScrolling();
        }
      }
    }, speed);
  };

  const stopScrolling = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
    setIsScrolling(false);
  };

  // 在组件卸载时清理
  useEffect(() => {
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!script) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          脚本不存在或已被删除
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      {/* 顶部操作栏 */}
      <Box sx={{ 
        width: '100%',
        maxWidth: '210mm',
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {/* 第一行：返回按钮和模式切换 */}
        {!isTeleprompterMode && (
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/scripts')}
          sx={{ textTransform: 'none' }}
        >
          返回列表
            </Button>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                startIcon={<AutoStoriesIcon />}
                onClick={handleTeleprompterToggle}
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                提词器模式
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/scripts/${id}/edit`)}
          sx={{ textTransform: 'none' }}
        >
          编辑脚本
        </Button>
      </Stack>
          </Box>
        )}

        {/* 提词器模式下的控制面板 */}
        {isTeleprompterMode && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            width: '100%',
            bgcolor: 'white',
            p: 2,
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Button
              variant="outlined"
              startIcon={<AutoStoriesIcon />}
              onClick={handleTeleprompterToggle}
              color="secondary"
              sx={{ 
                textTransform: 'none',
                minWidth: '120px'
              }}
            >
              退出提词器
            </Button>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 1
            }}>
              <Typography variant="body1" sx={{ minWidth: '80px' }}>滚动速度</Typography>
              <Slider
                value={scrollSpeed}
                onChange={handleScrollSpeedChange}
                aria-labelledby="scroll-speed-slider"
                valueLabelDisplay="auto"
                min={0}
                max={100}
                sx={{ mx: 2 }}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={isScrolling ? <PauseIcon /> : <PlayArrowIcon />}
              onClick={isScrolling ? stopScrolling : startScrolling}
              sx={{ 
                minWidth: '120px',
                height: '40px'
              }}
            >
              {isScrolling ? '暂停' : '开始'}
            </Button>
          </Box>
        )}
      </Box>

      {/* 脚本内容区域 */}
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        position: 'relative'
      }}>
        <Paper sx={{ 
          width: '100%',
          maxWidth: isTeleprompterMode ? '315mm' : '210mm',
          p: 4,
          bgcolor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          ...(isTeleprompterMode && {
            fontSize: '1.5rem',
            lineHeight: 2,
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
          })
        }}
        ref={contentRef}
        >
      {/* 脚本基本信息 */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                ...(isTeleprompterMode && { fontSize: '2rem' })
              }}
            >
              {script.title}
            </Typography>
            {script?.alternative_title1 && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontSize: isTeleprompterMode ? '1.5rem' : 'inherit' }}
              >
                {script.alternative_title1}
              </Typography>
            )}

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Chip
                label={script.status || '未设置'}
                color="secondary"
                variant="outlined"
                clickable={false}
              />
              {script.category && (
                <Chip
                  label={script.category.category_name}
                  color="primary"
                  variant="outlined"
                  clickable={false}
                />
              )}
              {script.channel && (
                <Chip
                  label={script.channel.channel_name}
                  color="info"
                  variant="outlined"
                  clickable={false}
                />
              )}
              {script.difficulty && renderStars(script.difficulty)}
            </Stack>

          {script.description && (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mt: 2,
                  ...(isTeleprompterMode && { fontSize: '1.5rem' })
                }}
              >
                {script.description}
              </Typography>
          )}

            <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: isTeleprompterMode ? '1.2rem' : 'inherit' }}
              >
                创建时间：{format(new Date(script?.created_at || ''), 'yyyy-MM-dd HH:mm')}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: isTeleprompterMode ? '1.2rem' : 'inherit' }}
              >
                最后修改：{format(new Date(script?.updated_at || ''), 'yyyy-MM-dd HH:mm')}
              </Typography>
              {script?.release_date && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: isTeleprompterMode ? '1.2rem' : 'inherit' }}
                >
                  发布日期：{script.release_date}
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

      {/* 章节列表 */}
      {script.chapters && script.chapters.length > 0 && (
            <Box>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  ...(isTeleprompterMode && { fontSize: '2rem' })
                }}
              >
            章节列表
          </Typography>
              <Stack spacing={4}>
            {script.chapters.map((chapter) => (
                  <Box key={chapter.chapter_number} sx={{ mb: 4 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 'bold',
                        ...(isTeleprompterMode && { fontSize: '1.8rem' })
                      }}
                    >
                    第 {chapter.chapter_number} 章：{chapter.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      '& img': { maxWidth: '100%', height: 'auto' },
                        lineHeight: 1.8,
                        fontSize: isTeleprompterMode ? '1.5rem' : '1.1rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                  />
                  </Box>
            ))}
          </Stack>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ScriptPreview; 