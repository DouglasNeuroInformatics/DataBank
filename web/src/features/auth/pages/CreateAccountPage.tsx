import { useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { type CreateAccountData, CreateAccountForm } from '../components/CreateAccountForm';

import { useAuthStore } from '@/stores/auth-store';

export const CreateAccountPage = () => {
  const auth = useAuthStore();
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const createAccount = async (data: CreateAccountData) => {
    await axios.post('/v1/auth/account', data);
    notifications.addNotification({ type: 'success', message: t('pleaseSignIn') });
    auth.logout();
    navigate('/auth/login');
  };

  return (
    <AuthLayout title={t('createAccount')}>
      <CreateAccountForm onSubmit={createAccount} />
    </AuthLayout>
  );
};
