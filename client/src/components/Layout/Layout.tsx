import React, { FC } from 'react';

import { Box, Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { UserMenu } from '../UserMenu';

export const Layout: FC = () => {
  return (
    <>
      <Container maxWidth="xl" sx={{ minHeight: '100vh', pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Typography
            variant="h5"
            align="center"
            component="h1"
            sx={{ color: '#1f1e1e', fontWeight: 500 }}
          >
            CRYPTO X
          </Typography>
          <UserMenu />
        </Box>
        <Outlet />
      </Container>
    </>
  );
};
