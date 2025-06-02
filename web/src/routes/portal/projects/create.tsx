import { createFileRoute } from '@tanstack/react-router';

import { CreateProjectPage } from '@/features/projects/pages/CreateProjectPage';

export const Route = createFileRoute('/portal/projects/create')({
  component: CreateProjectPage
});
