import { useRef } from 'react';

import { Hero } from '../components/Hero';
import { KeyFeatures } from '../components/KeyFeatures';
import { LandingHeader } from '../components/LandingHeader';

export const LandingPage = () => {
  const keyFeaturesRef = useRef<HTMLElement>(null);

  return (
    <div className="flex h-screen flex-col">
      <LandingHeader />
      <main className="container flex grow flex-col items-center justify-center">
        <Hero
          onLearnMore={() => {
            keyFeaturesRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <KeyFeatures ref={keyFeaturesRef} />
      </main>
    </div>
  );
};
