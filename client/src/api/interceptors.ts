import { User } from '@types/getaway/auth';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import { baseApi } from './config';
import { ROUTES } from '../router/routerTypes';

baseApi.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
);

baseApi.interceptors.response.use(
  response => response,
  async error => {
    console.log('errpr => ', error);

    if (!error.response) return Promise.reject(error);

    const originalRequest: AxiosRequestConfig & { _retry: boolean } = error.config
    switch (true) {
      // the AccessToken could be expired and we try to make refresh
      case error.response === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('refresh'): {
        originalRequest._retry = true;
        console.log('originalRequest._retry', originalRequest);

        console.log('show errr', error.message);
        toast.error(error.message);

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
        console.log('show errr', error.message);
        toast.error(error.message);
        return Promise.reject(error.response.data);
      }
    }

    console.log('show errr', error.message);
    toast.error(error.message);

    return Promise.reject(error);
  },
);
