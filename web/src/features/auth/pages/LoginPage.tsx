import { useEffect } from 'react';

import type { AuthPayload, LoginCredentials } from '@databank/types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (auth.accessToken) {
      navigate('/portal/dashboard');
    }
  }, [auth.accessToken]);

  const login = async (credentials: LoginCredentials) => {
    const response = await axios.post<AuthPayload>('/v1/auth/login', credentials);
    auth.setAccessToken(response.data.accessToken);
  };

  return (
    <AuthLayout title={t('login')}>
      <LoginForm onSubmit={(data) => void login(data)} />
    </AuthLayout>
  );
};
