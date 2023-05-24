import { clsx } from 'clsx';
import { Inter } from 'next/font/google';
import '@/styles/index.css';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: {
    locale: 'en' | 'fr';
  };
}) {
  let messages;
  try {
    messages = (await import(`@/translations/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang="en">
      <body className={clsx(inter.className, 'flex')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Sidebar />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
