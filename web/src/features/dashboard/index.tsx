import React from 'react';

import type { RouteObject } from 'react-router-dom';

import { PublicLayout } from '@/components/Layout/PublicLayout';

import { viewOnePublicDatasetsRoute } from '../dataset/pages/ViewOnePublicDatasetPage';
import { viewPublicDatasetsRoute } from '../dataset/pages/ViewPublicDatasetsPage';

export * from './pages/DashboardPage';

export const publicDatasetsRoute: RouteObject = {
  children: [viewPublicDatasetsRoute, viewOnePublicDatasetsRoute],
  element: <PublicLayout />,
  path: 'public'
};