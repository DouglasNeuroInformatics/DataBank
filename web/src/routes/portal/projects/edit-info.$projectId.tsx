/* eslint-disable perfectionist/sort-objects */
import { $ISODate } from '@databank/core';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod/v4';

import { EditProjectInfoPage } from '@/features/projects/pages/EditProjectInfoPage';

const $EditProjectInfoSearchParams = z.object({
  name: z.string(),
  description: z.string().optional(),
  externalId: z.string().optional(),
  expiryDate: $ISODate
});
type $EditProjectInfoSearchParams = z.infer<typeof $EditProjectInfoSearchParams>;

export const Route = createFileRoute('/portal/projects/edit-info/$projectId')({
  validateSearch: $EditProjectInfoSearchParams,
  component: () => {
    return <EditProjectInfoPage />;
  }
});
