import React from 'react';

import { Box, CircularProgress, Container } from '@mui/material';

export const FullScreenLoader = () => {
  return (
    <Container sx={{ height: '100%' }}>
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
};
