import React from 'react';

import { NotificationHub } from '@douglasneuroinformatics/ui';
import { createPortal } from 'react-dom';

import { Router } from './Router';
import { SuspenseFallback } from './components';
import { SetupProvider } from './features/setup';
import './services/axios';
import './services/i18n';

export const App = () => {
  return (
    <React.Suspense fallback={<SuspenseFallback className="h-screen w-screen" />}>
      <SetupProvider>
        <Router />
      </SetupProvider>
      {createPortal(<NotificationHub timeout={10000} />, document.body)}
    </React.Suspense>
  );
};
