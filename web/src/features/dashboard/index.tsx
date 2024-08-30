import React from 'react';

import type { RouteObject } from 'react-router-dom';

import { PublicLayout } from '@/components/Layout/PublicLayout';

import { ViewOnePublicDatasetRoute } from '../dataset/pages/ViewOnePublicDatasetPage';
import { ViewPublicDatasetsRoute } from '../dataset/pages/ViewPublicDatasetsPage';

export * from './pages/DashboardPage';

export const publicDatasetsRoute: RouteObject = {
  children: [ViewPublicDatasetsRoute, ViewOnePublicDatasetRoute],
  element: <PublicLayout />,
  path: 'public'
};
