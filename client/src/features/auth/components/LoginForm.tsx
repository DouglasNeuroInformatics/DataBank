import { useEffect } from 'react';

import { LoginCredentials } from '@databank/types';
import { Form, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '@/stores/auth-store';

export interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const auth = useAuthStore();
  const notifications = useNotificationsStore();
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
    onSuccess();
  };

  return (
    <Form<LoginCredentials>
      content={{
        email: { kind: 'text', label: t('email'), variant: 'short' },
        password: { kind: 'text', label: t('password'), variant: 'password' }
      }}
      submitBtnLabel={t('login')}
      validationSchema={{
        type: 'object',
        properties: {
          email: {
            type: 'string',
            minLength: 1
          },
          password: {
            type: 'string',
            minLength: 1
          }
        },
        required: ['email', 'password'],
        errorMessage: {
          properties: {
            username: t('requiredField'),
            password: t('requiredField')
          }
        }
      }}
      onSubmit={login}
    />
  );
};
