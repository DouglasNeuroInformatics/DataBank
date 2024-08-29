/* eslint-disable perfectionist/sort-objects */

import React from 'react';

import { Navigate, type RouteObject } from 'react-router-dom';

import { ConfirmEmailPage } from './pages/ConfirmEmailPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { LoginPage } from './pages/LoginPage';

export const authRoutes: RouteObject = {
  path: 'auth',
  children: [
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'create-account',
      element: <CreateAccountPage />
    },
    {
      path: 'confirm-email-code',
      element: <ConfirmEmailPage />
    },
    {
      index: true,
      path: '*',
      element: <Navigate to="/auth/login" />
    }
  ]
};
