import React from 'react';

import { LandingFooter } from '@/components/LandingFooter';
import { Navbar } from '@/components/Navbar';
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
    <div className="container min-h-screen flex flex-col">
      <Navbar
        links={[
          {
            href: '/login',
            label: 'Login'
          },
          {
            href: '/sign-up',
            label: 'Sign Up'
          }
        ]}
      />
      <section className="mb-8 flex flex-col justify-between gap-6 sm:gap-10 md:mb-16 md:gap-16 lg:flex-row">
        <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left xl:w-5/12">
          <p className="mb-4 font-semibold text-indigo-500 md:mb-6 md:text-lg xl:text-xl">Very proud to introduce</p>
          <h1 className="text-black-800 mb-8 text-4xl font-bold sm:text-5xl md:mb-12 md:text-6xl">
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
        {/* content - end */}
        {/* image - start */}
        <div className="h-48 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-96 xl:w-5/12">
          <img
            alt="Photo by Fakurian Design"
            className="h-full w-full object-cover object-center"
            loading="lazy"
            src="https://images.unsplash.com/photo-1618556450991-2f1af64e8191?auto=format&q=75&fit=crop&w=1000"
          />
        </div>
        {/* image - end */}
      </section>
      <LandingFooter />
    </div>
  );
}
