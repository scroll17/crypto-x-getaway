import React from 'react';

import {Box, CircularProgress, Container, Typography} from '@mui/material';

export const ConfirmTokenLoader = () => {
  return (
    <Container sx={{ height: '95vh' }}>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" sx={{ height: '50%' }}>
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <CircularProgress />
        </Box>
        <Typography variant="h6">Ожидание подтверждения токена...</Typography>
      </Box>
    </Container>
  );
};
