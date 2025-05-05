import { useEffect } from 'react';
import * as React from 'react';

import { useRouter } from '@tanstack/react-router';

import { useSetupState } from '@/hooks/useSetupState';

import { useCreateSetupState } from '../hooks/useCreateSetupState';
import { SetupLoadingPage } from '../pages/SetupLoadingPage';
import { SetupPage } from '../pages/SetupPage';

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const setupStateQuery = useSetupState();
  const createSetupStateMutation = useCreateSetupState();
  const router = useRouter();

  useEffect(() => {
    if (setupStateQuery.data?.isSetup === false) {
      router.history.replace('/');
    }
  }, [setupStateQuery.data]);

  if (setupStateQuery.data?.isSetup !== false) {
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
