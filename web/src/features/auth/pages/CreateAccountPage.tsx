import { useEffect } from 'react';

import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';

import { useAuthStore } from '@/stores/auth-store';

import { AuthLayout } from '../components/AuthLayout';
import { CreateAccountForm } from '../components/CreateAccountForm';

import type { CreateAccountData } from '../components/CreateAccountForm';

export const CreateAccountPage = () => {
  const auth = useAuthStore();
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (auth.accessToken && auth.currentUser?.confirmedAt) {
      void navigate({ to: '/portal/dashboard' });
    } else if (auth.accessToken) {
      void navigate({ to: '/auth/confirm-email-code' });
    }
  }, [auth.accessToken]);

  const createAccount = async (data: CreateAccountData) => {
    await axios.post('/v1/auth/account', { ...data, datasetId: [] });
    notifications.addNotification({ message: t('pleaseSignIn'), type: 'success' });
    auth.logout();
    void navigate({ to: '/auth/login' });
  };

  return (
    <AuthLayout maxWidth="md" title={t('createAccount')}>
      <CreateAccountForm onSubmit={(data) => void createAccount(data)} />
    </AuthLayout>
  );
};
