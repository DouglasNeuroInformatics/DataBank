import React, { useEffect } from 'react';

import { useSetupState } from '@/hooks/useSetupState';

import { useCreateSetupState } from '../hooks/useCreateSetupState';
import { SetupLoadingPage } from '../pages/SetupLoadingPage';
import { SetupPage } from '../pages/SetupPage';

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const setupStateQuery = useSetupState();
  const createSetupStateMutation = useCreateSetupState();

  useEffect(() => {
    if (!setupStateQuery.data) {
      window.history.replaceState({}, '', '/setup');
    }
  }, [setupStateQuery.data]);

  if (setupStateQuery.data?.isSetup) {
    return children;
  } else if (createSetupStateMutation.isPending) {
    return <SetupLoadingPage subtitle="Setup Loading Subtitle" title="Setup Loading Title" />;
  }

  return (
    <SetupPage
      onSubmit={(SetupDto) => {
        createSetupStateMutation.mutate(SetupDto);
      }}
    />
  );
};
