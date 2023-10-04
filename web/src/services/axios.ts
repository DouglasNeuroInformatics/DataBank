import { type ExceptionResponse } from '@databank/types';
import { useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios, { isAxiosError } from 'axios';

import { useAuthStore } from '@/stores/auth-store';

import i18n from './i18n';

axios.defaults.baseURL = '/api';

axios.interceptors.request.use((config) => {
  const auth = useAuthStore.getState();

  config.headers.setAccept('application/json');
  config.headers.set('Accept-Language', i18n.resolvedLanguage ?? 'en');

  if (auth.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const notifications = useNotificationsStore.getState();

    let message: string;
    if (isAxiosError<ExceptionResponse>(error) && error.response) {
      message = `${error.response.status}: ${error.response.statusText}`;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = '';
    }

    notifications.addNotification({
      message,
      type: 'error'
    });

    return Promise.reject(error);
  }
);

export default axios;
