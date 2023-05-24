import React from 'react';

import { Inter } from 'next/font/google';
import Image from 'next/image';

import { clsx } from 'clsx';

import { ClientTranslationsProvider } from '@/context/ClientTranslations';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { type Locale, i18n } from '@/i18n-config';
import logo from '@/public/logo.png';
import '@/styles/index.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export default async function Root({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  const t = await useServerTranslations(params.lang);
  return (
    <html lang={params.lang}>
      <body className={clsx(inter.className, 'flex')}>
        <div className="flex h-screen w-80 flex-col bg-slate-900 p-3 text-slate-300">
          <div className="flex items-center p-1 md:p-2">
            <Image alt="logo" className="mr-2 w-14 md:w-16" src={logo} />
            <span className="text-sm uppercase leading-tight antialiased md:text-base" style={{ maxWidth: '7.5em' }}>
              Data Bank
            </span>
          </div>
          <hr className="my-1" />
          <nav></nav>
          <hr className="my-1 mt-auto" />
        </div>
        <main>
          <ClientTranslationsProvider t={t}>{children}</ClientTranslationsProvider>
        </main>
      </body>
    </html>
  );
}
