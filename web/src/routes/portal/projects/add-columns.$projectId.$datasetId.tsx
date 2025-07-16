import { createFileRoute } from '@tanstack/react-router';

import AddProjectDatasetColumnPage from '@/features/projects/pages/AddProjectDatasetColumnPage';

export const Route = createFileRoute('/portal/projects/add-columns/$projectId/$datasetId')({
  component: AddProjectDatasetColumnPage
});
