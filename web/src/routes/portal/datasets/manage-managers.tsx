import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4';

import { ManageDatasetManagersPage } from '@/features/dataset/pages/ManageDatasetManagersPage';

export const Route = createFileRoute('/portal/datasets/manage-managers')({
  component: ManageDatasetManagersPage,
  validateSearch: z.object({
    datasetId: z.string(),
    isManager: z.boolean(),
    managerIds: z.string().array().min(1)
  })
});
