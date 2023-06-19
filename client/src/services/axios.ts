import { ExceptionResponse } from '@databank/types';
import { useNotificationsStore } from '@douglasneuroinformatics/react-components';
import axios, { AxiosError, isAxiosError } from 'axios';

import { useAuthStore } from '@/stores/auth-store';
import i18n from './i18n';

axios.defaults.baseURL = import.meta.env.VITE_API_HOST;

axios.interceptors.request.use((config) => {
  const auth = useAuthStore.getState();

  config.headers.setAccept('application/json');

  if (auth.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const notifications = useNotificationsStore.getState();

    console.log(i18n.resolvedLanguage)

    // const message = error instanceof Error ? error.message : 'An unknown error occurred';

    let message: string;
    if (isAxiosError<ExceptionResponse>(error) && error.response) {
      message = error.response.data.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = '';
    }

    notifications.addNotification({
      type: 'error',
      message
    });

    return Promise.reject(error);
  }
);

export default axios;
