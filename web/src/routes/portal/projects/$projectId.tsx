import { createFileRoute } from '@tanstack/react-router';

import { ViewOneProjectPage } from '@/features/projects/pages/ViewOneProjectPage';

export const Route = createFileRoute('/portal/projects/$projectId')({
  component: ViewOneProjectPage
});
