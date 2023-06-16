import { useTranslation } from 'react-i18next';

import { AuthLayout } from '../components/AuthLayout';
import { VerifyAccountData, VerifyAccountForm } from '../components/VerifyAccountForm';

export const VerifyAccountPage = () => {
  const { t } = useTranslation();

  const handleSubmit = (data: VerifyAccountData) => {
    alert(JSON.stringify(data));
  };

  return <AuthLayout form={<VerifyAccountForm onSubmit={handleSubmit} />} title={t('verifyAccount')} />;
};
