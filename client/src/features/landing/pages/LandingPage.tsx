import { Hero } from '../components/Hero';
import { LandingHeader } from '../components/LandingHeader';

import { withTransition } from '@/utils/withTransition';

export const LandingPage = withTransition(() => {
  return (
    <div className="flex h-screen flex-col">
      <LandingHeader />
      <main className="container flex flex-grow items-center justify-center">
        <Hero />
      </main>
    </div>
  );
});
