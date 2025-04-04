import { Hero } from '../components/Hero';
import { LandingHeader } from '../components/LandingHeader';
import { MoreInfo } from '../components/MoreInfo';

export const LandingPage = () => {
  return (
    <div className="flex h-screen flex-col">
      <LandingHeader />
      <main className="container flex grow flex-col items-center justify-center">
        <Hero />
        <MoreInfo />
      </main>
    </div>
  );
};
