import { createFileRoute } from '@tanstack/react-router';

import { LandingPage } from '@/features/landing';

const Route = createFileRoute('/')({
  component: LandingPage
});

export { Route };
