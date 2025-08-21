import { createFileRoute } from '@tanstack/react-router';

import { ViewOneProjectDatasetPage } from '@/features/projects/pages/ViewOneProjectDatasetPage';

export const Route = createFileRoute('/portal/projects/view-project-dataset/$projectId/$datasetId')({
  component: ViewOneProjectDatasetPage
});
