import { useNotificationsStore } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { type CreateAccountData, CreateAccountForm } from '../components/CreateAccountForm';

export const CreateAccountPage = () => {
  const notifications = useNotificationsStore();
  const handleSubmit = async (data: CreateAccountData) => {
    const response = await axios.post('/v1/auth/account', data, {
      validateStatus: (status) => status === 201 || status === 409
    });
    if (response.status === 409) {
      notifications.addNotification({
        type: 'error',
        message: t('alreadyRegistered')
      });
      return;
    }
    alert(JSON.stringify(data));
  };

  const navigate = useNavigate();
  const { t } = useTranslation();

  return <AuthLayout form={<CreateAccountForm onSubmit={handleSubmit} />} title={t('createAccount')} />;
};
