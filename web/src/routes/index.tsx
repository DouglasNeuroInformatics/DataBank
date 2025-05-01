import { createFileRoute } from '@tanstack/react-router';

import { LandingPage } from '@/features/landing';

// const Landing = () => {
//   return <h1>Landing Page</h1>
// }

const Route = createFileRoute('/')({
  component: LandingPage
});

export { Route };
