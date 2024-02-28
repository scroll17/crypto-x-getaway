import React, { useEffect, useState, FC, FormEvent } from 'react';

import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

import { login, refresh } from '@api-r/getaway/auth';
import { AxiosErrorData } from '@types/common';
import { GetawayAuthQueryKeys, UserLoginData } from '@types/getaway/auth';
import { isEmailValid } from '@utils/isEmailValid';

export const LoginForm: FC = () => {
  const [email, setEmail] = useState('zololotarenko.2015@gmail.com');
  const [password, setPassword] = useState('sd234c-012');
  const [error, setError] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state?.from.pathname as string) || '/';

  //  API Login Mutation
  const { mutate: loginUser, isLoading } = useMutation(
    (userData: UserLoginData) => login(userData),
    {
      onSuccess: () => {
        toast.success('You successfully logged in');
        navigate(from);
      },
      onError: (error: AxiosError<AxiosErrorData>) => {
        if (error instanceof AxiosError && error.response) {
          toast.error(error.response.data.message, {
            position: 'top-right',
          });
        }
      },
    },
  );

  const refreshTokenMutation = useMutation([GetawayAuthQueryKeys.RefreshToken], refresh, {
    retry: 1,
    onSuccess: () => {
      navigate(from);
    },
    onError: (error: AxiosError<AxiosErrorData>) => {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message, {
          position: 'top-right',
        });
      }
    },
  });

  useEffect(() => refreshTokenMutation.mutate(), []);

  useEffect(() => {
    setError(email.length === 0 || password.length === 0);
  }, [email, password]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      setError(true);
      return;
    }
    loginUser({ email, password });
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h4">Вход</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder="Email адрес"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder="Пароль"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={error || isLoading}
            fullWidth
            sx={{ mt: 3 }}
          >
            Войти
          </Button>
        </form>
      </Box>
    </Container>
  );
};
