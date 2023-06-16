import React from 'react';

import { NotificationHub } from '@douglasneuroinformatics/react-components';
import { createPortal } from 'react-dom';

import { SuspenseFallback } from './components';
import { Router } from './Router';

import './services/axios';
import './services/i18n';

export const App = () => {
  return (
    <React.Suspense fallback={<SuspenseFallback />}>
      <Router />
      {createPortal(<NotificationHub />, document.body)}
    </React.Suspense>
  );
};
