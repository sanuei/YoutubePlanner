import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CategoryManagement: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        分类管理
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography color="textSecondary">
          此功能正在开发中...
        </Typography>
      </Box>
    </Paper>
  );
};

export default CategoryManagement; 