import { createFileRoute } from '@tanstack/react-router';

import { Layout } from '@/components';

export const Route = createFileRoute('/portal')({
  component: Layout
});
