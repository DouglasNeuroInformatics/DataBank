import { useEffect } from 'react';

import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

import { AuthLayout } from '../components/AuthLayout';
import { type CreateAccountData, CreateAccountForm } from '../components/CreateAccountForm';

export const CreateAccountPage = () => {
  const auth = useAuthStore();
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (auth.accessToken && auth.currentUser?.confirmedAt) {
      navigate('/portal/dashboard');
    } else if (auth.accessToken) {
      navigate('/auth/confirm-email-code');
    }
  }, [auth.accessToken]);

  const createAccount = async (data: CreateAccountData) => {
    await axios.post('/v1/auth/account', data);
    notifications.addNotification({ message: t('pleaseSignIn'), type: 'success' });
    auth.logout();
    navigate('/auth/login');
  };

  return (
    <AuthLayout title={t('createAccount')}>
      <CreateAccountForm onSubmit={(data) => void createAccount(data)} />
    </AuthLayout>
  );
};
