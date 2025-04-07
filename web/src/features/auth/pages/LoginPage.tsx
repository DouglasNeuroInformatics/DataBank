import { useEffect } from 'react';

import type { AuthPayload, LoginCredentials } from '@databank/core';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (auth.accessToken && auth.currentUser?.confirmedAt) {
      navigate('/portal/dashboard');
    } else if (auth.accessToken) {
      navigate('/auth/confirm-email-code');
    }
  }, [auth.accessToken]);

  const login = async (credentials: LoginCredentials) => {
    const response = await axios.post<AuthPayload>('/v1/auth/login', credentials);
    auth.setAccessToken(response.data.accessToken);
  };

  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
      void login({
        email: import.meta.env.VITE_DEV_EMAIL!,
        password: import.meta.env.VITE_DEV_PASSWORD!
      });
    }
  }, []);

  return (
    <AuthLayout title={t('login')}>
      <LoginForm onSubmit={(data) => void login(data)} />
    </AuthLayout>
  );
};
