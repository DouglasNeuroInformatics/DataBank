import { NotificationHub } from '@douglasneuroinformatics/react-components';
import { createPortal } from 'react-dom';

import { Router } from './Router';

import './services/axios';
import './services/i18n';

export const App = () => {
  return (
    <>
      <Router />
      {createPortal(<NotificationHub />, document.body)}
    </>
  );
};
