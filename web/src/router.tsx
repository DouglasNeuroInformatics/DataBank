import { useEffect } from 'react';

import { errorToJSON } from '@douglasneuroinformatics/libjs';
import { Button, Spinner } from '@douglasneuroinformatics/libui/components';
import { useDownload, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createRouter, Navigate } from '@tanstack/react-router';
import type { ErrorRouteComponent } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { getReasonPhrase } from 'http-status-codes';

import { routeTree } from './route-tree';
import { queryClient } from './services/react-query';
import { useAppStore } from './store';

declare module '@tanstack/react-router' {
  interface HistoryState {
    [key: string]: unknown;
  }
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {}
}

const DefaultErrorComponent: ErrorRouteComponent = ({ error, reset }) => {
  const download = useDownload();

  useEffect(() => {
    console.error(error);
  }, [error]);

  let heading = 'Unknown Error';
  if (isAxiosError(error) && error.status) {
    heading = `${error.status} - ${getReasonPhrase(error.status)}`;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-1 p-3 text-center">
      <h1 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">Something Went Wrong</h1>
      <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{heading}</h3>
      <p className="text-muted-foreground mt-2 max-w-prose text-sm sm:text-base">
        We apologize for the inconvenience. Please download the error report using the button below and send it to your
        platform administrator for further assistance.
      </p>
      <div className="mt-6 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void download('error.json', JSON.stringify(errorToJSON(error), null, 2));
          }}
        >
          Error Report
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            reset();
          }}
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
};

const DefaultNotFoundComponent = () => {
  const isAuthenticated = useAppStore((store) => !!store.auth.ctx.accessToken);
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-1 p-3 text-center">
      <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        {t({
          en: '404 - Not Found',
          fr: '404 - Introuvable'
        })}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-prose text-sm sm:text-base">
        {t({
          en: 'Sorry, the page you were looking for could not be found.',
          fr: "Désolé, la page que vous recherchez n'a pu être trouvée."
        })}
      </p>
    </div>
  );
};

const defaultPendingComponent = () => (
  <div className="flex grow items-center justify-center">
    <Spinner />
  </div>
);

export const router = createRouter({
  context: {
    queryClient
  },
  defaultErrorComponent: DefaultErrorComponent,
  defaultNotFoundComponent: DefaultNotFoundComponent,
  defaultPendingComponent: defaultPendingComponent,
  defaultPendingMinMs: 500,
  defaultPendingMs: 500,
  defaultPreload: false,
  defaultPreloadStaleTime: 0,
  defaultStructuralSharing: true,
  routeTree,
  scrollRestoration: true
});
