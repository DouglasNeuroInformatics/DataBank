/* eslint-disable perfectionist/sort-objects */
import { $PermissionLevel } from '@databank/core';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod/v4';

import { EditDatasetInfoPage } from '@/features/dataset/pages/EditDatasetInfoPage';

const $EditDatasetInfoSearchParams = z.object({
  description: z.string().optional(),
  license: z.string(),
  name: z.string(),
  permission: $PermissionLevel
});
type $EditDatasetInfoSearchParams = z.infer<typeof $EditDatasetInfoSearchParams>;

export const Route = createFileRoute('/portal/datasets/edit-info/$datasetId')({
  validateSearch: $EditDatasetInfoSearchParams,
  component: () => {
    return <EditDatasetInfoPage />;
  }
});
