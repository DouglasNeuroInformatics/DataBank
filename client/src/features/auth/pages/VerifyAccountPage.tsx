import { useEffect, useState } from 'react';

import { VerificationProcedureInfo } from '@databank/types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { Countdown } from '../components/Countdown';
import { VerificationCodeInput } from '../components/VerificationCodeInput';

import { SuspenseFallback } from '@/components';

export const VerifyAccountPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [seconds, setSeconds] = useState<number>();
  // const email = searchParams.get('email');

  /** Send code and then set seconds to milliseconds remaining in minutes, rounded down, converted to seconds */
  const sendVerificationCode = async () => {
    const response = await axios.post<VerificationProcedureInfo>('/v1/auth/verification-code');
    setSeconds(Math.floor((response.data.expiry - Date.now()) / 60000) * 60);
  };

  const verifyCode = async (code: number) => {
    const response = await axios.post('/v1/auth/verify', { code });
  };

  useEffect(() => {
    void sendVerificationCode();
  }, []);

  return seconds ? (
    <AuthLayout title={t('verifyAccount')}>
      <VerificationCodeInput className="my-5" onComplete={verifyCode} />
      <Countdown seconds={300} />
    </AuthLayout>
  ) : (
    <SuspenseFallback className="h-screen w-screen" />
  );
};
