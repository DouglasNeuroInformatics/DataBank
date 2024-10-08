import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import axios, { isAxiosError } from 'axios';

import { useAuthStore } from '@/stores/auth-store';

import i18n from './i18n';

axios.defaults.baseURL = '/api';

axios.interceptors.request.use((config) => {
  const auth = useAuthStore.getState();

  config.headers.setAccept('application/json');
  // config.headers.set('Accept-Language', i18n.resolvedLanguage ?? 'en');

  if (auth.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const notifications = useNotificationsStore.getState();
    if (!isAxiosError(error)) {
      notifications.addNotification({
        message: i18n.t({
          en: 'Unknown Error',
          fr: 'Erreur inconnue'
        }),
        type: 'error'
      });
      console.error(error);
      return Promise.reject(error as Error);
    }
    notifications.addNotification({
      message: i18n.t({
        en: 'HTTP Request Failed',
        fr: 'Échec de la requête HTTP'
      }),
      title: error.response?.status.toString(),
      type: 'error'
    });
    return Promise.reject(error);
  }
);

export default axios;
