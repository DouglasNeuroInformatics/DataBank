import React from 'react';

import { Inter } from 'next/font/google';

import { clsx } from 'clsx';

import { Sidebar } from '@/components/Sidebar';
import { ClientTranslationsProvider } from '@/context/ClientTranslations';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { type Locale, i18n } from '@/i18n-config';
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
        <Sidebar />
        <main>
          <ClientTranslationsProvider t={t}>{children}</ClientTranslationsProvider>
        </main>
      </body>
    </html>
  );
}
