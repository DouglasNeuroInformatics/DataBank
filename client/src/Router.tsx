import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components';
import { CreateAccountPage, LoginPage, VerifyAccountPage } from './features/auth';
import { LandingPage } from './features/landing';
import { useAuthStore } from './stores/auth-store';

export const Router = () => {
  const { accessToken } = useAuthStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route element={<LoginPage />} path="/auth/login" />
        <Route element={<CreateAccountPage />} path="/auth/create-account" />
        <Route element={<VerifyAccountPage />} path="/auth/verify-account" />
        {accessToken ? (
          <Route element={<Layout />}>
            <Route index element={<div />} path="overview" />
          </Route>
        ) : (
          <Route element={<Navigate to="login" />} path="*" />
        )}
      </Routes>
    </BrowserRouter>
  );
};
