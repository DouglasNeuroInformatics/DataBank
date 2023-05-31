import React from 'react';

import { Navbar } from '@/components/Navbar';
import { type Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

interface IndexPageProps {
  params: {
    locale: Locale;
  };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <React.Fragment>
      <header>
        <Navbar
          links={[
            {
              href: `/${params.locale}/auth/login`,
              label: t.nav.login
            },
            {
              href: `/${params.locale}/auth/create-account`,
              label: t.nav.createAccount
            }
          ]}
        />
      </header>
    </React.Fragment>
  );
}
