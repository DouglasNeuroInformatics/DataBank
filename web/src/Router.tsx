/* eslint-disable perfectionist/sort-objects */
import { useEffect } from 'react';
import React from 'react';

import type { AuthPayload } from '@databank/types';
import axios from 'axios';
import { BrowserRouter, Navigate, type RouteObject, useRoutes } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { authRoutes } from './features/auth';
import { publicDatasetsRoute } from './features/dashboard';
import { viewDatasetsRoute } from './features/dataset/pages/ViewDatasetsPage';
import { LandingPage } from './features/landing';
import { useAuthStore } from './stores/auth-store';

const publicRoutes: RouteObject[] = [
  authRoutes,
  publicDatasetsRoute,
  {
    index: true,
    element: <LandingPage />
  },
  {
    path: '*',
    element: <Navigate to={'/auth/login'} />
  }
];

const protectedRoutes: RouteObject[] = [
  authRoutes,
  // other routes for pages that do not need the layout wrapper
  {
    path: 'dashboard',
    element: <Layout />,
    children: [
      // many routes provided in the features folder that needs the layout template
      viewDatasetsRoute
    ]
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
