import { useEffect, useState } from 'react';

import { AuthPayload, EmailConfirmationProcedureInfo } from '@databank/types';
import { useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '../components/AuthLayout';
import { Countdown } from '../components/Countdown';
import { ConfirmEmailCodeInput } from '../components/ConfirmEmailCodeInput';

import { SuspenseFallback } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

export const VerifyAccountPage = () => {
  const auth = useAuthStore();
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState<number>();

  useEffect(() => {
    void sendConfirmEmailCode();
  }, []);

  useEffect(() => {
    if (auth.currentUser?.isVerified) {
      navigate('/portal/dashboard');
    }
  }, [auth.currentUser]);

  /** Send code and then set seconds to milliseconds remaining in minutes, rounded down, converted to seconds */
  const sendConfirmEmailCode = async () => {
    const response = await axios.post<EmailConfirmationProcedureInfo>('/v1/auth/confirm-email-code');
    setSeconds(Math.floor((response.data.expiry - Date.now()) / 60000) * 60);
  };

  const verifyCode = async (code: number) => {
    const response = await axios.post<AuthPayload>('/v1/auth/verify', { code });
    notifications.addNotification({ type: 'success' });
    auth.setAccessToken(response.data.accessToken);
  };

  return seconds ? (
    <AuthLayout title={t('verifyAccount')}>
      <ConfirmEmailCodeInput className="my-5" onComplete={verifyCode} />
      <Countdown seconds={seconds} />
    </AuthLayout>
  ) : (
    <SuspenseFallback className="h-screen w-screen" />
  );
};
