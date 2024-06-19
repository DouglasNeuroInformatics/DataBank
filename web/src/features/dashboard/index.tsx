import React from 'react';

import type { RouteObject } from 'react-router-dom';

import { Layout } from '@/components';
import { PublicLayout } from '@/components/Layout/PublicLayout';

import { authRoutes } from '../auth';
import { viewDatasetsRoute } from '../dataset/pages/ViewDatasetsPage';
import { viewOnePublicDatasetsRoute } from '../dataset/pages/ViewOnePublicDatasetPage';
import { viewPublicDatasetsRoute } from '../dataset/pages/ViewPublicDatasetsPage';
import { DashboardRoute } from './pages/DashboardPage';

export * from './pages/DashboardPage';

export const publicDatasetsRoute: RouteObject = {
  children: [viewPublicDatasetsRoute, viewOnePublicDatasetsRoute],
  element: <PublicLayout />,
  path: 'public'
};

export const protectedRoutes: RouteObject[] = [
  authRoutes,
  {
    children: [viewDatasetsRoute, DashboardRoute],
    element: <Layout />,
    path: 'portal'
  }
];
