import React from 'react';

import { Inter } from 'next/font/google';

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

export default function Root({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
