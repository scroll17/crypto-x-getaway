import {AxiosErrorData} from '@types/common';
import {User} from '@types/getaway/auth';
import axios from 'axios';
import {AxiosError, AxiosRequestConfig} from 'axios';
import {redirect} from 'react-router-dom';
import {toast} from 'react-toastify';

import {ROUTES} from '../router/routerTypes';

const BASE_URL = process.env.BASE_API_URL;

// Axios instance and default configuration
export const baseApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

baseApi.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
);

baseApi.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response) return Promise.reject(error);

    switch (true) {
      case Boolean(error.response.data): {
        const errorData = error.response.data as AxiosErrorData;

        if('status' in errorData && errorData.status) {
          toast.error(`(${errorData.status.code}) ${errorData.status.text}`);
        } else {
          toast.error(`(${errorData.error}) ${errorData.message}`);
        }

          break;
      }
      default: {
        toast.error(error.message);
        break;
      }
    }

    const originalRequest: AxiosRequestConfig & { _retry: boolean } = error.config;
    switch (true) {
      // the AccessToken could be expired and we try to make refresh
      case error.response === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('refresh'): {
        originalRequest._retry = true;
        console.log('originalRequest._retry', originalRequest);

        try {
          const response = await baseApi.get<User>('auth/refresh');
          if (response.status === 201) {
            return baseApi(originalRequest);
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
          toast.error('You are not logged ');
          redirect(ROUTES.Login);
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
