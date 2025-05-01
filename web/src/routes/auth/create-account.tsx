import { createFileRoute } from '@tanstack/react-router';

import { CreateAccountPage } from '@/features/auth/pages/CreateAccountPage';

export const Route = createFileRoute('/auth/create-account')({
  component: CreateAccountPage
});
