import { useEffect } from 'react';

import { AuthPayload } from '@databank/types';
import axios from 'axios';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { match } from 'ts-pattern';

import { Layout } from './components';
import { CreateAccountPage, LoginPage, VerifyAccountPage } from './features/auth';
import { CreateDatasetPage } from './features/create';
import { DashboardPage } from './features/dashboard';
import { LandingPage } from './features/landing';
import { ManageDatasetPage, ManagePage } from './features/manage';
import { SharedDatasetPage, SharedPage } from './features/shared';
import { UserPage } from './features/user';
import { useAuthStore } from './stores/auth-store';

const AppRoutes = () => {
  const { currentUser, setAccessToken } = useAuthStore();

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

  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="auth">
        <Route element={<LoginPage />} path="login" />
        <Route element={<CreateAccountPage />} path="create-account" />
        <Route element={<VerifyAccountPage />} path="verify-account" />
      </Route>
      {match(currentUser)
        .with({ isVerified: true }, () => (
          <Route element={<Layout />} path="portal">
            <Route index element={<DashboardPage />} path="dashboard" />
            <Route path="create">
              <Route index element={<CreateDatasetPage />} />
            </Route>
            <Route path="manage">
              <Route index element={<ManagePage />} />
              <Route element={<ManageDatasetPage />} path=":id" />
            </Route>
            <Route path="shared">
              <Route index element={<SharedPage />} />
              <Route element={<SharedDatasetPage />} path=":id" />
            </Route>
            <Route element={<UserPage />} path="user" />
          </Route>
        ))
        .with({ isVerified: false }, () => <Route element={<Navigate to={'/auth/verify-account'} />} path="*" />)
        .otherwise(() => (
          <Route element={<Navigate to="/" />} path="*" />
        ))}
    </Routes>
  );
};

export const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
