import { createFileRoute } from '@tanstack/react-router';

import { ViewOneDatasetPage } from '@/features/dataset/pages/ViewOneDatasetPage';

export const Route = createFileRoute('/public/dataset/$datasetId')({
  component: () => <ViewOneDatasetPage isPublic={true} />
});
