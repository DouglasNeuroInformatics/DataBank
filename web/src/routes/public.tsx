import { createFileRoute } from '@tanstack/react-router';

import { PublicLayout } from '@/components/Layout/PublicLayout';

export const Route = createFileRoute('/public')({
  component: PublicLayout
});
