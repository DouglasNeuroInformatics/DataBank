import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { match } from 'ts-pattern';

import { Layout } from './components';
import { CreateAccountPage, LoginPage, VerifyAccountPage } from './features/auth';
import { LandingPage } from './features/landing';
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
            <Route element={<Layout />}>
              <Route index element={<div />} path="overview" />
              <Route index element={<UserPage />} path="user" />
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
