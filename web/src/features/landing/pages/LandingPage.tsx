import { Hero } from '../components/Hero';
import { LandingHeader } from '../components/LandingHeader';

export const LandingPage = () => {
  return (
    <div className="flex h-screen flex-col">
      <LandingHeader />
      <main className="container flex grow items-center justify-center">
        <Hero />
      </main>
    </div>
  );
};
