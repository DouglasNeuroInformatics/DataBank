import { createFileRoute } from '@tanstack/react-router';

import { ViewOnePublicDatasetPage } from '@/features/dataset/pages/ViewOnePublicDatasetPage';

export const Route = createFileRoute('/public/dataset/$datasetId')({
  component: ViewOnePublicDatasetPage
});
