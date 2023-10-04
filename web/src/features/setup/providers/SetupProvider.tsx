import React, { useEffect, useState } from 'react';

import type { SetupOptions, SetupState } from '@databank/types';
import { FormPageWrapper, useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { SetupForm } from '../components/SetupForm';

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const notifications = useNotificationsStore();

  const [state, setState] = useState<SetupState>(() => {
    const savedSetup = window.localStorage.getItem('databankSetup');
    if (!savedSetup) {
      return { isSetup: null };
    }
    return JSON.parse(savedSetup) as SetupState;
  });

  const fetchSetupState = async () => {
    const response = await axios.get<SetupState>('/v1/setup');
    setState(response.data);
  };

  const handleSubmit = async (data: SetupOptions) => {
    try {
      await axios.post('/v1/setup', data);
      setState({ isSetup: true });
      notifications.addNotification({ type: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.localStorage.setItem('databankSetup', JSON.stringify(state));
    if (state.isSetup === null) {
      fetchSetupState().catch(console.error);
    } else if (!state.isSetup) {
      window.history.replaceState({}, '', '/setup');
    }
  }, [state]);

  return match(state)
    .with({ isSetup: null }, () => (
      <div>
        <p>Loading/Chargement...</p>
      </div>
    ))
    .with({ isSetup: false }, () => (
      <FormPageWrapper
        languageToggle={{
          dropdownDirection: 'up',
          options: ['en', 'fr']
        }}
        logo="/logo.png"
        title={t('setup')}
        widthMultiplier={1.5}
      >
        <SetupForm onSubmit={(data) => void handleSubmit(data)} />
      </FormPageWrapper>
    ))
    .with({ isSetup: true }, () => children)
    .exhaustive();
};
