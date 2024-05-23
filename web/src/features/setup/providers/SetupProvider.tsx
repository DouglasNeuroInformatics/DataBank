// import React, { useEffect, useState } from 'react';

// import type { SetupOptions, SetupState } from '@databank/types';
// import { FormPageWrapper, useNotificationsStore } from '@douglasneuroinformatics/ui';
// import axios from 'axios';
// import { useTranslation } from 'react-i18next';
// import { match } from 'ts-pattern';

// import { SetupForm } from '../components/SetupForm';

// export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
//   const { t } = useTranslation();
//   const notifications = useNotificationsStore();

//   const [state, setState] = useState<SetupState>(() => {
//     const savedSetup = window.localStorage.getItem('databankSetup');
//     if (!savedSetup) {
//       return { isSetup: false };
//     }
//     return JSON.parse(savedSetup) as SetupState;
//   });

//   const fetchSetupState = async () => {
//     const response = await axios.get<SetupState>('/v1/setup');
//     setState(response.data);
//   };

//   const handleSubmit = async (data: SetupOptions) => {
//     try {
//       await axios.post('/v1/setup', data);
//       setState({ isSetup: true });
//       notifications.addNotification({ type: 'success' });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     window.localStorage.setItem('databankSetup', JSON.stringify(state));
//     if (state.isSetup === null) {
//       fetchSetupState().catch(console.error);
//     } else if (!state.isSetup) {
//       window.history.replaceState({}, '', '/setup');
//     }
//   }, [state]);

//   return match(state)
//     .with({ isSetup: null }, () => (
//       <div>
//         <p>Loading/Chargement...</p>
//       </div>
//     ))
//     .with({ isSetup: false }, () => (
//       <FormPageWrapper
//         languageToggle={{
//           dropdownDirection: 'up',
//           options: ['en', 'fr']
//         }}
//         logo="/logo.png"
//         title={t('setup')}
//         widthMultiplier={1.5}
//       >
//         <SetupForm onSubmit={(data) => void handleSubmit(data)} />
//       </FormPageWrapper>
//     ))
//     .with({ isSetup: true }, () => children)
//     .exhaustive();
// };
import React, { useEffect } from 'react';

import { useSetupState } from '@/hooks/useSetupState';

import { useCreateSetupState } from '../hooks/useCreateSetupState';
import { SetupLoadingPage } from '../pages/SetupLoadingPage';
import { SetupPage } from '../pages/SetupPage';

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const setupStateQuery = useSetupState();
  const createSetupStateMutation = useCreateSetupState();

  useEffect(() => {
    if (setupStateQuery.data?.isSetup === false) {
      window.history.replaceState({}, '', '/setup');
    }
  }, [setupStateQuery.data]);

  if (setupStateQuery.data?.isSetup !== false) {
    return children;
  } else if (createSetupStateMutation.isPending) {
    return <SetupLoadingPage />;
  }

  return (
    <SetupPage
      onSubmit={({ dummySubjectCount, firstName, initDemo, lastName, password, username }) => {
        createSetupStateMutation.mutate({
          admin: {
            firstName,
            lastName,
            password,
            username
          },
          dummySubjectCount,
          initDemo
        });
      }}
    />
  );
};
