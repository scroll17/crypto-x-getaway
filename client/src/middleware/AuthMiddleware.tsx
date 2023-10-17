import React from 'react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { getMe } from '../api/authApi';
import { useStateContext } from '../context';
import { FullScreenLoader } from '../components/FullScreenLoader';
import { Layout } from '../components/Layout';
import { Navigate, useLocation } from 'react-router-dom';

const AuthMiddleware: React.FC = () => {
  const [cookies] = useCookies(['logged_in']);
  const stateContext = useStateContext();
  const location = useLocation();

  const { isLoading, isFetching } = useQuery(['authUser'], getMe, {
    retry: 1,
    select: data => data.data.user,
    onSuccess: data => {
      stateContext.dispatch({ type: 'SET_USER', payload: data });
    },
  });

  if (isLoading || isFetching) {
    return <FullScreenLoader />;
  }

  return cookies.logged_in ? (
    <Layout />
  ) : cookies.logged_in ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AuthMiddleware;
