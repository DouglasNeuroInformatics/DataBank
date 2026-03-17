import axios from 'axios';

import { useAppStore } from '@/store';

import i18n from './i18n';

axios.defaults.baseURL = '/api';

axios.interceptors.request.use((config) => {
  const { auth } = useAppStore.getState();

  config.headers.setAccept('application/json');
  config.timeout = 10000; // abort request after 10 seconds
  config.timeoutErrorMessage = i18n.t({
    en: 'Network Error',
    fr: 'Erreur de réseau'
  });

  if (auth.ctx.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.ctx.accessToken}`);
  }

  return config;
});
