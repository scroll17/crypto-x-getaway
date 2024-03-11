import React, { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { useCookies } from 'react-cookie';
import { useMutation, useQuery } from 'react-query';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getMe, refresh } from '@api-r/getaway/auth';
import { AxiosErrorData } from '@types/common';
import { GetawayAuthQueryKeys } from '@types/getaway/auth';

import { ConfirmTokenLoader } from '../components/ConfirmTokenLoader';
import { FullScreenLoader } from '../components/FullScreenLoader';
import { Layout } from '../components/Layout';
import { useStateContext } from '../context';
import { ACTION_TYPE } from '../context/types';

const AuthMiddleware: React.FC = () => {
  const [cookies] = useCookies(['logged_in']);
  const [confirmed, setConfirm] = useState(false);

  const stateContext = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();

  const authQuery = useQuery([GetawayAuthQueryKeys.AuthUser], getMe, {
    enabled: false,
    retry: 1,
    onSuccess: data => {
      setConfirm(true);
      stateContext.dispatch({ type: ACTION_TYPE.SetUser, payload: data });
    },
    onError: (error: AxiosError<AxiosErrorData>) => {
      const response = error!.response;
      if (error instanceof AxiosError && response) {
        toast.error(response.data.message, {
          position: 'top-right',
        });

        if (['Unauthorized', 'Token is revoked'].includes(response.data.message)) {
          navigate('/login');
        } else {
          setConfirm(false);
          setTimeout(() => authQuery.refetch(), 5000); // 5 sec
        }
      }
    },
  });

  const refreshTokenMutation = useMutation([GetawayAuthQueryKeys.RefreshToken], refresh, {
    retry: 1,
    onSuccess: () => authQuery.refetch(),
    onError: (error: AxiosError<AxiosErrorData>) => {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message, {
          position: 'top-right',
        });

        navigate('/login');
      }
    },
  });

  // TODO: deps haven't be empty?
  useEffect(() => refreshTokenMutation.mutate(), []);

  if (refreshTokenMutation.isLoading || !authQuery.isFetched) {
    return <FullScreenLoader />;
  }

  if (authQuery.isFetching || !confirmed) {
    return <ConfirmTokenLoader />;
  }

  return cookies.logged_in
    ? (<Layout />)
    : (<Navigate to="/login" state={{ from: location }} replace />);
};

export default AuthMiddleware;
