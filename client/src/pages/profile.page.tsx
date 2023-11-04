import React from 'react';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useStateContext } from '../context';

const ProfilePage = () => {
  const stateContext = useStateContext();

  const user = stateContext.state.authUser;

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: '#f1f1f1',
        minHeight: '100vh',
      }}
    >
      <Box
        maxWidth="lg"
        sx={{
          maxHeight: '20rem',
          pl: '10rem',
          pt: '2rem',
          position: 'relative',
        }}
      >
        <Link to="/">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            sx={{ position: 'absolute', left: 0, top: '2rem' }}
          >
            Back
          </Button>
        </Link>

        <Typography variant="h3" component="h1" sx={{ color: '#1f1e1e', fontWeight: 500 }}>
          Profile Page
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
              <strong>Id:</strong> {user?.id}
            </Typography>
            <Typography gutterBottom>
              <strong>Full Name:</strong> {`${user?.firstName}  ${user?.lastName}`}
            </Typography>
            <Typography gutterBottom>
              <strong>Email Address:</strong> {user?.email}
            </Typography>
            <Typography gutterBottom>
              <strong>Phone:</strong> {user?.phone}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="outlined">connect google</Button>
            <Button variant="outlined">connect telegram</Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
