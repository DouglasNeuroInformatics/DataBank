import { useEffect } from 'react';

import { LoginCredentials } from '@databank/types';
import { useNotificationsStore } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

import { useAuthStore } from '@/stores/auth-store';

export const LoginPage = () => {
  const auth = useAuthStore();
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH) {
      void login({
        email: import.meta.env.VITE_DEV_EMAIL,
        password: import.meta.env.VITE_DEV_PASSWORD
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Do not throw if unauthorized, so we can send a better error message
    const response = await axios.post<{ accessToken: string }>('/v1/auth/login', credentials, {
      validateStatus: (status) => status === 200 || status === 401
    });
    if (response.status === 401) {
      notifications.addNotification({
        type: 'error',
        title: t('unauthorizedError.title'),
        message: t('unauthorizedError.message')
      });
      return;
    }
    auth.setAccessToken(response.data.accessToken);
    navigate('/overview');
  };

  return (
    <AuthLayout title={t('login')}>
      <LoginForm onSubmit={login} />
    </AuthLayout>
  );
};
