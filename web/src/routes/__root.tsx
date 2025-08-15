import { createRootRoute, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { SetupProvider } from '@/features/setup';

export const Route = createRootRoute({
  component: () => (
    <SetupProvider>
      <Outlet />
      {/* <TanStackRouterDevtools hidden='true' position="bottom-right" /> */}
    </SetupProvider>
  )
});
