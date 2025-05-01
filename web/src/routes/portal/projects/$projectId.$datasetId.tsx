import { createFileRoute } from '@tanstack/react-router';

import { ViewOneProjectDatasetPage } from '@/features/projects/pages/ViewOneProjectDatasetPage';

export const Route = createFileRoute('/portal/projects/$projectId/$datasetId')({
  component: ViewOneProjectDatasetPage
});
