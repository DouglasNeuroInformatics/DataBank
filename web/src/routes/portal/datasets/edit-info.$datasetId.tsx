import { createFileRoute } from '@tanstack/react-router';

import { EditDatasetInfoPage } from '@/features/dataset/pages/EditDatasetInfoPage';

export const Route = createFileRoute('/portal/datasets/edit-info/$datasetId')({
  component: EditDatasetInfoPage
});
