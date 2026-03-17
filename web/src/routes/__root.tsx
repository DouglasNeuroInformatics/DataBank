import React from 'react';

import { CoreProvider } from '@douglasneuroinformatics/libui/providers';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import '@/services/axios';
import '@/services/i18n';

type RouterContext = {
  queryClient: QueryClient;
};

const RouteComponent = () => {
  return (
    <React.Fragment>
      <CoreProvider>
        <Outlet />
      </CoreProvider>
      {import.meta.env.DEV && (
        <div className="hidden md:block">
          <ReactQueryDevtools buttonPosition="top-right" />
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      )}
    </React.Fragment>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RouteComponent
});
