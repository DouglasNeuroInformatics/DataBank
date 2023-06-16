import { Hero } from '../components/Hero';
import { LandingHeader } from '../components/LandingHeader';

export const LandingPage = () => {
  return (
    <>
      <LandingHeader />
      <main className="container flex flex-grow items-center justify-center">
        <Hero />
      </main>
    </>
  );
};
