import { createFileRoute, redirect } from '@tanstack/react-router';

import { Layout } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

export const Route = createFileRoute('/portal')({
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/auth/login' });
    }
  },
  component: Layout
});
