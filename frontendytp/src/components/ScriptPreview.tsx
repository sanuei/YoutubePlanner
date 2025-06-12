import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Star as StarIcon,
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
    <Box sx={{ p: 3 }}>
      {/* 顶部操作栏 */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/scripts')}
          sx={{ textTransform: 'none' }}
        >
          返回列表
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

      {/* 脚本基本信息 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {script.title}
            </Typography>
            {script.alternative_title1 && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {script.alternative_title1}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={script.status || '未设置'}
                color="secondary"
                variant="outlined"
              />
              {script.category && (
                <Chip
                  label={script.category.category_name}
                  color="primary"
                  variant="outlined"
                />
              )}
              {script.channel && (
                <Chip
                  label={script.channel.channel_name}
                  color="info"
                  variant="outlined"
                />
              )}
              {script.difficulty && renderStars(script.difficulty)}
            </Stack>
          </Grid>

          {script.description && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                {script.description}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Stack direction="row" spacing={4}>
              <Typography variant="body2" color="text.secondary">
                创建时间：{format(new Date(script.created_at), 'yyyy-MM-dd HH:mm')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最后修改：{format(new Date(script.updated_at), 'yyyy-MM-dd HH:mm')}
              </Typography>
              {script.release_date && (
                <Typography variant="body2" color="text.secondary">
                  发布日期：{script.release_date}
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* 章节列表 */}
      {script.chapters && script.chapters.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            章节列表
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {script.chapters.map((chapter) => (
              <Card key={chapter.chapter_number} variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    第 {chapter.chapter_number} 章：{chapter.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      '& img': { maxWidth: '100%', height: 'auto' },
                    }}
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                  />
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default ScriptPreview; 