import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoComponentProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
  onClick?: () => void;
  sx?: any;
}

const LogoComponent: React.FC<LogoComponentProps> = ({
  size = 'medium',
  showText = true,
  color = 'white',
  onClick,
  sx = {}
}) => {
  const sizeConfig = {
    small: { logoSize: '24px', fontSize: 'body1' },
    medium: { logoSize: '32px', fontSize: 'h6' },
    large: { logoSize: '48px', fontSize: 'h5' }
  };

  const config = sizeConfig[size];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          opacity: 0.8
        } : {},
        ...sx
      }}
      onClick={onClick}
    >
      <Box
        component="img"
        src="/typlogo.png"
        alt="YouTube Planner Logo"
        sx={{
          width: config.logoSize,
          height: config.logoSize,
          mr: showText ? 1 : 0,
          borderRadius: '4px',
        }}
      />
      {showText && (
        <Typography
          variant={config.fontSize as any}
          sx={{
            color: color,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          YouTube Planner
        </Typography>
      )}
    </Box>
  );
};

export default LogoComponent; 