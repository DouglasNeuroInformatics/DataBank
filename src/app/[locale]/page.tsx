import React from 'react';

import Link from 'next/link';

import { Branding } from '@/components/Branding';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

interface IndexPageProps {
  params: {
    locale: Locale;
  };
}

const IndexPage = async ({ params }: IndexPageProps) => {
  const t = await getTranslations(params.locale);
  return (
    <React.Fragment>
      <header className="container flex w-screen items-center justify-between border-b p-2">
        <Branding />
        <div className="flex items-center gap-5">
          <nav className="flex gap-5">
            <Link href={`/${params.locale}/auth/login`}>{t['login']}</Link>
            <Link href={`/${params.locale}/auth/create-account`}>{t['createAccount']}</Link>
          </nav>
          <div className="h-6 border-l" />
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>
    </React.Fragment>
  );
};

export default IndexPage;
