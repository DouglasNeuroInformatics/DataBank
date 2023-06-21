import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { match } from 'ts-pattern';

import { Layout } from './components';
import { CreateAccountPage, LoginPage, VerifyAccountPage } from './features/auth';
import { DashboardPage } from './features/dashboard';
import { EditorPage } from './features/editor';
import { LandingPage } from './features/landing';
import { SharedPage } from './features/shared';
import { UserPage } from './features/user';
import { useAuthStore } from './stores/auth-store';

export const Router = () => {
  const { currentUser } = useAuthStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route element={<LoginPage />} path="/auth/login" />
        <Route element={<CreateAccountPage />} path="/auth/create-account" />
        <Route element={<VerifyAccountPage />} path="/auth/verify-account" />
        {match(currentUser)
          .with({ isVerified: true }, () => (
            <Route element={<Layout />} path="portal">
              <Route index element={<DashboardPage />} path="dashboard" />
              <Route element={<EditorPage />} path="editor" />
              <Route element={<SharedPage />} path="shared" />
              <Route element={<UserPage />} path="user" />
            </Route>
          ))
          .with({ isVerified: false }, () => <Route element={<Navigate to={'/auth/verify-account'} />} path="*" />)
          .otherwise(() => (
            <Route element={<Navigate replace={true} to="/" />} path="*" />
          ))}
      </Routes>
    </BrowserRouter>
  );
};
