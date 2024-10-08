import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App.js';

import '@douglasneuroinformatics/libui/tailwind/globals.css';

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
