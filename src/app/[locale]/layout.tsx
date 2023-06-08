import React from 'react';

import { cookies } from 'next/headers';

import { NotificationHub } from '@douglasneuroinformatics/react-components';

import { ClientTranslationsProvider } from '@/context/ClientTranslations';
import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

import '@/styles/index.css';

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export default async function Root({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  const translations = await getTranslations(params.locale);
  const cookieStore = cookies();

  const theme = cookieStore.get('theme');

  return (
    <html className={theme?.value} lang={params.locale}>
      <body className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
        <ClientTranslationsProvider translations={translations}>{children}</ClientTranslationsProvider>
        <NotificationHub />
      </body>
    </html>
  );
}
