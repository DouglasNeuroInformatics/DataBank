import { useEffect, useRef } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { Countdown } from '../components/Countdown';
import { VerificationCodeInput } from '../components/VerificationCodeInput';

export const VerifyAccountPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const sendVerificationCode = async () => {
    const response = await axios.post('/v1/auth/verification-code');
    console.log(response);
  };

  useEffect(() => {
    sendVerificationCode();
  }, []);

  return (
    <AuthLayout title={t('verifyAccount')}>
      <VerificationCodeInput className="my-5" onComplete={(code) => alert(code)} />
      <Countdown seconds={3600} />
    </AuthLayout>
  );
};
