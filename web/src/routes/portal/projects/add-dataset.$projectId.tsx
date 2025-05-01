import { createFileRoute } from '@tanstack/react-router';

import { AddProjectDatasetPage } from '@/features/projects/pages/AddProjectDatasetPage';

export const Route = createFileRoute('/portal/projects/add-dataset/$projectId')({
  component: AddProjectDatasetPage
});
