import { createFileRoute } from '@tanstack/react-router';

import { ViewOneDatasetPage } from '@/features/dataset/pages/ViewOneDatasetPage';

export const Route = createFileRoute('/portal/datasets/$datasetId')({
  component: () => <ViewOneDatasetPage isPublic={false} />
});
