import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { match } from 'ts-pattern';

import { Layout } from './components';
import { CreateAccountPage, LoginPage, VerifyAccountPage } from './features/auth';
import { DashboardPage } from './features/dashboard';
import { EditorPage } from './features/editor';
import { LandingPage } from './features/landing';
import { SharedDatasetPage, SharedPage } from './features/shared';
import { UserPage } from './features/user';
import { useAuthStore } from './stores/auth-store';

export const Router = () => {
  const { currentUser } = useAuthStore();
  return (
    <BrowserRouter>
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
              <Route element={<EditorPage />} path="editor" />
              <Route path="shared">
                <Route index element={<SharedPage />} />
                <Route element={<SharedDatasetPage />} path=":id" />
              </Route>
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
