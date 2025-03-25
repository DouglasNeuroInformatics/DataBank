/* eslint-disable perfectionist/sort-objects */

import { BrowserRouter, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { Layout } from './components';
import { authRoutes } from './features/auth';
import { DashboardRoute, publicDatasetsRoute } from './features/dashboard';
import { CreateDatasetRoute } from './features/dataset/pages/CreateDatasetPage';
import { EditDatasetInfoRoute } from './features/dataset/pages/EditDatasetInfoPage';
import { ManageDatasetManagersRoute } from './features/dataset/pages/ManageDatasetManagersPage';
import { ViewDatasetsRoute } from './features/dataset/pages/ViewDatasetsPage';
import { ViewOneDatasetRoute } from './features/dataset/pages/ViewOneDatasetPage';
import { LandingPage } from './features/landing';
import { AddProjectDatasetColumnRoute } from './features/projects/pages/AddProjectDatasetColumnPage';
import { AddProjectDatasetRoute } from './features/projects/pages/AddProjectDatasetPage';
import { CreateProjectRoute } from './features/projects/pages/CreateProjectPage';
import { EditProjectInfoRoute } from './features/projects/pages/EditProjectInfoPage';
import { ManageProjectUsersRoute } from './features/projects/pages/ManageProjectUsersPage';
import { ViewOneProjectDatasetRoute } from './features/projects/pages/ViewOneProjectDatasetPage';
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

const protectedRoutes: RouteObject[] = [
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
      ViewOneProjectDatasetRoute,
      ViewProjectsRoute,
      ViewOneProjectRoute,
      UserRoute,
      CreateProjectRoute,
      AddProjectDatasetRoute,
      ManageDatasetManagersRoute,
      ManageProjectUsersRoute,
      EditDatasetInfoRoute,
      EditProjectInfoRoute,
      AddProjectDatasetColumnRoute
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
  const { accessToken } = useAuthStore();

  return useRoutes(accessToken ? protectedRoutes : publicRoutes);
};

export const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
