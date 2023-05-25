import React from 'react';

import Image from 'next/image';

import landingImage from '@/assets/landing.jpg';
import { LandingFooter } from '@/components/LandingFooter';
import { LandingHeader } from '@/components/LandingHeader';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { Locale } from '@/i18n-config';

interface IndexPageProps {
  params: {
    lang: Locale;
  };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const t = await useServerTranslations(params.lang);
  return (
    <div className="container flex min-h-screen flex-col">
      <LandingHeader />
      <section className="my-16 flex flex-grow flex-col justify-between gap-6 sm:gap-10 md:gap-16 lg:my-0 lg:flex-row">
        <div className="flex w-full flex-col justify-center sm:text-center lg:py-12 lg:text-left">
          <p className="mb-4 font-semibold text-indigo-500 md:mb-6 md:text-lg xl:text-xl">Proud to introduce</p>
          <h1 className="text-black-800 mb-8 text-3xl font-bold sm:text-4xl md:mb-12 md:text-5xl">
            {t['meta.platformName']}
          </h1>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
            <a
              className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
              href="#"
            >
              Start now
            </a>
            <a
              className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
              href="#"
            >
              Take tour
            </a>
          </div>
        </div>
        <div className="flex w-full items-center justify-center lg:w-3/4">
          <Image alt="science" src={landingImage} />
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
