import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App.js';

import './styles.css';
import './services/axios';
import './services/i18n';

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
