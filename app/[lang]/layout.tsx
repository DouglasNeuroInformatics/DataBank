import React from 'react';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import { clsx } from 'clsx';

import { AppProvider } from '@/components/AppProvider';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { type Locale, i18n } from '@/i18n-config';

import '@/styles/index.css';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export default async function Root({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  const translations = await useServerTranslations(params.lang);
  return (
    <html lang={params.lang}>
      <body className={clsx(inter.className, 'text-slate-900 dark:bg-slate-900 dark:text-white')}>
        <AppProvider translations={translations}>{children}</AppProvider>
      </body>
    </html>
  );
}
