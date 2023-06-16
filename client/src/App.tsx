import { NotificationHub } from '@douglasneuroinformatics/react-components';

import { Router } from './Router';

import './services/axios';
import './services/i18n';

export const App = () => {
  return (
    <>
      <NotificationHub />
      <Router />
    </>
  );
};
