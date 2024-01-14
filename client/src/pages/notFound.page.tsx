import React from 'react';

import { Box } from '@mui/material';

export const NotFoundPage = () => {
  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <h2>404 Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
    </Box>
  );
};
