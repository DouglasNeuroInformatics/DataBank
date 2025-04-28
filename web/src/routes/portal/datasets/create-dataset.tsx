import { createFileRoute } from '@tanstack/react-router';

import { CreateDatasetPage } from '@/features/dataset/pages/CreateDatasetPage';

export const Route = createFileRoute('/portal/datasets/create-dataset')({
  component: CreateDatasetPage
});
