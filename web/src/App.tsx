import React from 'react';

import { NotificationHub } from '@douglasneuroinformatics/libui/components';

import { Router } from './Router.js';
import { SuspenseFallback } from './components';
// import { SetupProvider } from './features/setup';

import './services/axios';
import './services/i18n';

export const App = () => {
  return (
    <React.Suspense fallback={<SuspenseFallback className="h-screen w-screen" />}>
      <NotificationHub />
      {/* <SetupProvider> */}
      <Router />
      {/* </SetupProvider> */}
    </React.Suspense>
  );
};
