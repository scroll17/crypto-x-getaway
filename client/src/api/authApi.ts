import axios from 'axios';
import { AuthRefresh } from './types';
import { UserLoginData } from '../components/LoginForm';

const BASE_URL = 'http://localhost:4040';

// Axios instance and default configuration
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common['Content-Type'] = 'application/json';

// Refresh the access token when it expires.
export const refreshAccessTokenFn = async () => {
  const response = await authApi.get<AuthRefresh>('auth/refresh');
  return response.data;
};

authApi.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;

    if (errMessage.includes('not logged in') && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return authApi(originalRequest);
    }
    return Promise.reject(error);
  },
);

authApi.interceptors.request.use(request => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

// Makes a POST request to sign in the registered user.
export const login = async (user: UserLoginData) => {
  const response = await authApi.post(`/auth/login`, user);

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
