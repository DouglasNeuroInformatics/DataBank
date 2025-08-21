import { Suspense } from 'react';

import { CoreProvider } from '@douglasneuroinformatics/libui/providers';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';

import { LoadingFallback } from './components';
import { ErrorPage } from './components/ErrorPage.js';
// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { queryClient } from './services/react-query.js';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <CoreProvider>
            <RouterProvider router={router} />
          </CoreProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
