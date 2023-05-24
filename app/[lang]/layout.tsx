import { clsx } from 'clsx';
import { Inter } from 'next/font/google';
import '@/styles/index.css';

import { type Locale, i18n } from '@/i18n-config';

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
    <html className={clsx(inter.className, 'flex')} lang={params.lang}>
      <body> {children}</body>
    </html>
  );
}
