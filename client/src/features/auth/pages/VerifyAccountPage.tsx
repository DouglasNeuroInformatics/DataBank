import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { VerifyAccountData, VerifyAccountForm } from '../components/VerifyAccountForm';

export const VerifyAccountPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email]);


  const handleSubmit = (data: VerifyAccountData) => {
    alert(JSON.stringify(data));
  };

  return (
    <AuthLayout title={t('verifyAccount')}>
      <VerifyAccountForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
};
