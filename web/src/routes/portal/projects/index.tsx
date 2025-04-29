import { createFileRoute } from '@tanstack/react-router';

import { ViewProjectsPage } from '@/features/projects/pages/ViewProjectsPage';

export const Route = createFileRoute('/portal/projects/')({
  component: ViewProjectsPage
});
