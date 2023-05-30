import React from 'react';

import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

import { clsx } from 'clsx';

import { ClientTranslationsProvider } from '@/context/ClientTranslations';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { type Locale, i18n } from '@/lib/i18n';

import '@/styles/index.css';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export const dynamic = 'force-static';

export default async function Root({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  const translations = await useServerTranslations(params.locale);
  const cookieStore = cookies();
  const theme = cookieStore.get('theme');
  return (
    <html className={theme?.value} lang={params.locale}>
      <body className={clsx(inter.className, 'text-slate-900 dark:bg-slate-900 dark:text-white')}>
        <ClientTranslationsProvider translations={translations}>
          {children}
        </ClientTranslationsProvider>
      </body>
    </html>
  );
}
