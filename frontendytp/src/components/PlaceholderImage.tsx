import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const PlaceholderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  minHeight: '200px',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

interface PlaceholderImageProps {
  width?: string | number;
  height?: string | number;
  text?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = '100%',
  height = 'auto',
  text = '示例图片'
}) => {
  return (
    <PlaceholderBox
      sx={{
        width,
        height,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        📷
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </PlaceholderBox>
  );
};

export default PlaceholderImage; 