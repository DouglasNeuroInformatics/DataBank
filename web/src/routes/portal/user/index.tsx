import { createFileRoute } from '@tanstack/react-router';

import { UserPage } from '@/features/user';

export const Route = createFileRoute('/portal/user/')({
  component: UserPage
});
