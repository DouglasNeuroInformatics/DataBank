import { useEffect, useRef, useState } from 'react';

import type { AuthPayload, EmailConfirmationProcedureInfo } from '@databank/core';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';

import { LoadingFallback } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

import { AuthLayout } from '../components/AuthLayout';
import { ConfirmEmailCodeInput } from '../components/ConfirmEmailCodeInput';
import { Countdown } from '../components/Countdown';

export const ConfirmEmailPage = () => {
  const auth = useAuthStore();
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [seconds, setSeconds] = useState<number>();
  const hasSentEmail = useRef(false);

  useEffect(() => {
    if (!hasSentEmail.current) {
      void sendConfirmEmailCode();
      hasSentEmail.current = true;
    }
  }, []);

  useEffect(() => {
    if (auth.currentUser?.confirmedAt) {
      void navigate({ to: '/' });
    }
  }, [auth.currentUser]);

  /** Send code and then set seconds to milliseconds remaining in minutes, rounded down, converted to seconds */
  const sendConfirmEmailCode = async () => {
    const response = await axios.post<EmailConfirmationProcedureInfo>('/v1/auth/confirm-email-code');
    setSeconds(Math.floor((new Date(response.data.expiry).getTime() - Date.now()) / 60000) * 60);
  };

  const verifyCode = async (code: number) => {
    const response = await axios.post<AuthPayload>('/v1/auth/verify-account', { code });
    notifications.addNotification({ type: 'success' });
    auth.setAccessToken(response.data.accessToken);
    void navigate({ to: '/portal/dashboard' });
  };

  return seconds ? (
    <AuthLayout maxWidth="sm" title={t('verifyAccount')}>
      <ConfirmEmailCodeInput className="my-5" onComplete={verifyCode} />
      <Countdown seconds={seconds} />
    </AuthLayout>
  ) : (
    <LoadingFallback />
  );
};
