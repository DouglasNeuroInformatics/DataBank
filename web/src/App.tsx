import React from 'react';

import { NotificationHub } from '@douglasneuroinformatics/libui/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import { Router } from './Router.js';
import { LoadingFallback } from './components';
import { ErrorPage } from './components/ErrorPage.js';
// import { SetupProvider } from './features/setup';
import { queryClient } from './services/react-query.js';

export const App = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <NotificationHub />
          {/* <SetupProvider> */}
          <Router />
          {/* </SetupProvider> */}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
