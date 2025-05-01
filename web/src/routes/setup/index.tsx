import { createFileRoute, redirect } from '@tanstack/react-router';
import axios from 'axios';
import { z } from 'zod';

import { SetupPage } from '@/features/setup/pages/SetupPage';

export const Route = createFileRoute('/setup/')({
  beforeLoad: async () => {
    const $SetupState = z.object({
      isSetup: z.boolean()
    });

    const response = await axios.get('/v1/setup');
    const setupState = await $SetupState.parseAsync(response.data);
    if (setupState.isSetup === false) {
      window.history.replaceState({}, '', '/setup');
    } else {
      // Redirect to portal if already initialized
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        replace: true,
        to: '/'
      });
    }
  },
  component: SetupPage
});
