import React, { useEffect, useState, FC, FormEvent } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

interface LoginProps {}

import { isEmailValid } from "../../utils/emailValidation";

export const LoginForm: FC<LoginProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(true);

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
        axios
            .post('/auth/login', {
                firstName: email,
                lastName: password,
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
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
                        label="Email адрес"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Пароль"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" type="submit" disabled={error} fullWidth sx={{ mt: 3 }}>
                        Войти
                    </Button>
                </form>
            </Box>
        </Container>
    );
};
