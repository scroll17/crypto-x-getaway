import React from 'react';

import { AxiosError } from 'axios';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getMe } from '../api/authApi';
import { AxiosErrorData, QUERY_KEYS } from '../api/types';
import { FullScreenLoader } from '../components/FullScreenLoader';
import { Layout } from '../components/Layout';
import { useStateContext } from '../context';
import { ACTION_TYPE } from '../context/types';

const AuthMiddleware: React.FC = () => {
  const [cookies] = useCookies(['logged_in']);
  const stateContext = useStateContext();
  const location = useLocation();

  const { isLoading, isFetching } = useQuery([QUERY_KEYS.AuthUser], getMe, {
    retry: 1,
    select: data => data.data.user,
    onSuccess: data => {
      stateContext.dispatch({ type: ACTION_TYPE.SetUser, payload: data });
    },
    onError: (error: AxiosError<AxiosErrorData>) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message, {
          position: 'top-right',
        });
      }
    },
  });

  if (isLoading || isFetching) {
    return <FullScreenLoader />;
  }

  return cookies.logged_in ? (
    <Layout />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AuthMiddleware;
