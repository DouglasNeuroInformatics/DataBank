import { createFileRoute } from '@tanstack/react-router';

import { ViewPublicDatasetsPage } from '@/features/dataset/pages/ViewPublicDatasetsPage';

export const Route = createFileRoute('/public/datasets')({
  component: ViewPublicDatasetsPage
});
