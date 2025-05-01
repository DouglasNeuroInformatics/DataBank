import { createFileRoute } from '@tanstack/react-router';

import { EditProjectInfoPage } from '@/features/projects/pages/EditProjectInfoPage';

export const Route = createFileRoute('/portal/projects/edit-info/$projectId')({
  component: EditProjectInfoPage
});
