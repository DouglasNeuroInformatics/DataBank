import React from 'react';

import { useServerTranslations } from '@/hooks/useServerTranslations';
import { Locale } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';

interface IndexPageProps {
  params: {
    locale: Locale;
  };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const t = await useServerTranslations(params.locale);
  return (
    <React.Fragment>
      <header>
        <Navbar
          links={[
            {
              href: '/login',
              label: t.nav.login
            },
            {
              href: '/create-account',
              label: t.nav.createAccount
            }
          ]}
        />
      </header>
    </React.Fragment>
  );
}
