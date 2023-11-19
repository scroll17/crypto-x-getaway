import React from 'react';
import { Suspense, lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

import { ROUTES } from './routerTypes';
import { FullScreenLoader } from '../components/FullScreenLoader';
import AuthMiddleware from '../middleware/AuthMiddleware';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import ProfilePage from '../pages/profile.page';

const Loadable = (Component: React.ComponentType) => (props: JSX.IntrinsicAttributes) => (
  <Suspense fallback={<FullScreenLoader />}>
    <Component {...props} />
  </Suspense>
);

const UnauthorizePage = Loadable(lazy(() => import('../pages/unauthorize.page')));

const authRoutes: RouteObject = {
  path: '*',
  children: [
    {
      path: ROUTES.Login,
      element: <LoginPage />,
    },
  ],
};

const normalRoutes: RouteObject = {
  path: '*',
  element: <AuthMiddleware />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: ROUTES.Profile,
      element: <ProfilePage />,
    },
    {
      path: ROUTES.Unauthorized,
      element: <UnauthorizePage />,
    },
  ],
};

const routes: RouteObject[] = [authRoutes, normalRoutes];

export default routes;
