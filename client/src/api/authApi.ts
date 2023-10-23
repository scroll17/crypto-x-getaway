import axios, { AxiosError } from 'axios';

import { User, UserLoginData } from './types';

const BASE_URL = 'http://localhost:4040';

// Axios instance and default configuration
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
);

authApi.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response) return Promise.reject(error);

    const originalRequest = error.config;
    switch (true) {
      // the AccessToken could be expired and we try to make refresh
      case error.response === 401 && !originalRequest._retry: {
        originalRequest._retry = true;
        console.log('originalRequest._retry', originalRequest);

        try {
          const response = await authApi.get<User>('auth/refresh');
          if (response.status === 201) {
            return authApi(originalRequest);
          }
        } catch (error) {
          console.log('originalRequest._retry', originalRequest);

          if (!(error instanceof AxiosError)) return Promise.reject(error);

          if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
          }

          return Promise.reject(error);
        }

        break;
      }
      // the second request is Unauthorised
      case error.response.status === 401: {
        if (window.location.pathname !== '/auth') {
          // redirect to "/auth"
        }
        break;
      }
      // just request to Forbidden resource
      case error.response.status === 403 && error.response.data: {
        return Promise.reject(error.response.data);
      }
    }

    return Promise.reject(error);
  },
);

// Makes a POST request to sign in the registered user.
export const login = async (user: UserLoginData) => {
  const response = await authApi.post('/auth/login', user);

  return response.data;
};

// Makes a GET request to log out the user.
export const logout = async () => {
  const response = await authApi.get('auth/logout');
  return response.data;
};

// Makes a GET request to retrieve the authenticated user’s credentials.
export const getMe = async () => {
  const response = await authApi.get('user/me');
  return response.data;
};
