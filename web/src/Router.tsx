/* eslint-disable perfectionist/sort-objects */
import { useEffect } from 'react';
import React from 'react';

import type { AuthPayload } from '@databank/types';
import axios from 'axios';
import { BrowserRouter, type RouteObject, useRoutes } from 'react-router-dom';

import { Layout } from './components';
import { authRoutes } from './features/auth';
import { DashboardRoute, publicDatasetsRoute } from './features/dashboard';
import { CreateDatasetRoute } from './features/dataset/pages/CreateDatasetPage';
import { ViewDatasetsRoute } from './features/dataset/pages/ViewDatasetsPage';
import { ViewOneDatasetRoute } from './features/dataset/pages/ViewOneDatasetPage';
import { LandingPage } from './features/landing';
import { AddProjectDatasetRoute } from './features/projects/pages/AddProjectDatasetPage';
import { CreateProjectRoute } from './features/projects/pages/CreateProjectPage';
import { ViewOneProjectRoute } from './features/projects/pages/ViewOneProjectPage';
import { ViewProjectsRoute } from './features/projects/pages/ViewProjectsPage';
import { UserRoute } from './features/user';
import { useAuthStore } from './stores/auth-store';

const publicRoutes: RouteObject[] = [
  authRoutes,
  publicDatasetsRoute,
  {
    index: true,
    path: '*',
    element: <LandingPage />
  }
];

export const protectedRoutes: RouteObject[] = [
  authRoutes,
  publicDatasetsRoute,
  {
    index: true,
    element: <LandingPage />
  },
  {
    children: [
      CreateDatasetRoute,
      DashboardRoute,
      ViewDatasetsRoute,
      ViewOneDatasetRoute,
      ViewProjectsRoute,
      ViewOneProjectRoute,
      UserRoute,
      CreateProjectRoute,
      AddProjectDatasetRoute
    ],
    element: <Layout />,
    path: 'portal'
  }
];

const AppRoutes = () => {
  /**
   * component to return the routes depending on the state of the access token
   * in the auth store
   *
   * at the first render, if the environment is DEV and the developer configured
   * the app to bypass auth, then a post request will be send to the backend to
   * fake the creation of a user and get back an access token
   */
  const { accessToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
      axios
        .post<AuthPayload>('/v1/auth/login', {
          email: import.meta.env.VITE_DEV_EMAIL,
          password: import.meta.env.VITE_DEV_PASSWORD
        })
        .then((response) => {
          setAccessToken(response.data.accessToken);
        })
        .catch(console.error);
    }
  }, []);

  return useRoutes(accessToken ? protectedRoutes : publicRoutes);
  // return useRoutes(protectedRoutes);
};

export const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
