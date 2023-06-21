import { useEffect } from 'react';

import { AuthPayload, LoginCredentials } from '@databank/types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

import { useAuthStore } from '@/stores/auth-store';

export const LoginPage = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
      void login({
        email: import.meta.env.VITE_DEV_EMAIL,
        password: import.meta.env.VITE_DEV_PASSWORD
      });
    }
  }, []);

  useEffect(() => {
    if (auth.accessToken) {
      navigate('/overview');
    }
  }, [auth.accessToken]);

  const login = async (credentials: LoginCredentials) => {
    const response = await axios.post<AuthPayload>('/v1/auth/login', credentials);
    auth.setAccessToken(response.data.accessToken);
  };

  return (
    <AuthLayout title={t('login')}>
      <LoginForm onSubmit={login} />
    </AuthLayout>
  );
};
