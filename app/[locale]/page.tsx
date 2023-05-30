import React from 'react';

import Image from 'next/image';

import landingImage from '@/assets/landing.jpg';
import { LandingFooter } from '@/components/LandingFooter';
import { LandingHeader } from '@/components/LandingHeader';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { Locale } from '@/lib/i18n';

interface IndexPageProps {
  params: {
    locale: Locale;
  };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const t = await useServerTranslations(params.locale);
  return <div>Hello World</div>;
}
