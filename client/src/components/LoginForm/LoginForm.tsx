import React, { useEffect, useState, FC, FormEvent } from 'react';

import { isEmailValid } from '../../utils/emailValidation';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { login } from '../../api/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useStateContext } from '../../context';
import { getMe } from '../../api/authApi';
import { toast } from 'react-toastify';

export type UserLoginData = { email: string; password: string };

export const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const from = ((location.state as any)?.from.pathname as string) || '/';

  const stateContext = useStateContext();

  // API Get Current Logged-in user
  const query = useQuery(['authUser'], getMe, {
    enabled: false,
    select: data => data.data,
    retry: 1,
    onSuccess: data => {
      stateContext.dispatch({ type: 'SET_USER', payload: data });
    },
  });

  //  API Login Mutation
  const { mutate: loginUser, isLoading } = useMutation(
    (userData: UserLoginData) => login(userData),
    {
      onSuccess: data => {
        stateContext.dispatch({ type: 'SET_USER', payload: data });

        query.refetch();
        toast.success('You successfully logged in');
        navigate(from);
      },
      onError: (error: any) => {
        if (Array.isArray((error as any).response.data.error)) {
          (error as any).response.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: 'top-right',
            }),
          );
        } else {
          toast.error((error as any).response.data.message, {
            position: 'top-right',
          });
        }
      },
    },
  );

  useEffect(() => {
    if (email.length === 0 || password.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
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
