import React, { FC } from 'react';

import { Box } from '@mui/material';

const labelStyle = {
  display: 'inline-block',
  padding: '5px 10px',
  borderRadius: '20px',
  marginLeft: '5px',
};

interface CustomLabelProps {
  text: string;
  customStyle?: Record<string, string>;
  component?: 'div' | 'span';
}
export const CustomLabel: FC<CustomLabelProps> = ({ text, customStyle, component = 'div' }) => {
  return (
    <Box
      component={component}
      sx={{
        ...labelStyle,
        ...customStyle,
      }}
    >
      {text}
    </Box>
  );
};
