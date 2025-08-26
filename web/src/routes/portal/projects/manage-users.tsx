import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4';

import { ManageProjectUsersPage } from '@/features/projects/pages/ManageProjectUsersPage';

export const Route = createFileRoute('/portal/projects/manage-users')({
  component: ManageProjectUsersPage,
  validateSearch: z.object({
    projectId: z.string(),
    userIds: z.string().array()
  })
});
