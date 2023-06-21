import { useEffect, useState } from 'react';

import { VerificationProcedureInfo } from '@databank/types';
import { useNotificationsStore } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { Countdown } from '../components/Countdown';
import { VerificationCodeInput } from '../components/VerificationCodeInput';

import { SuspenseFallback } from '@/components';

export const VerifyAccountPage = () => {
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState<number>();

  /** Send code and then set seconds to milliseconds remaining in minutes, rounded down, converted to seconds */
  const sendVerificationCode = async () => {
    const response = await axios.post<VerificationProcedureInfo>('/v1/auth/verification-code');
    setSeconds(Math.floor((response.data.expiry - Date.now()) / 60000) * 60);
  };

  const verifyCode = async (code: number) => {
    await axios.post('/v1/auth/verify', { code });
    notifications.addNotification({ type: 'success' });
    navigate('/overview');
  };

  useEffect(() => {
    void sendVerificationCode();
  }, []);

  return seconds ? (
    <AuthLayout title={t('verifyAccount')}>
      <VerificationCodeInput className="my-5" onComplete={verifyCode} />
      <Countdown seconds={seconds} />
    </AuthLayout>
  ) : (
    <SuspenseFallback className="h-screen w-screen" />
  );
};
