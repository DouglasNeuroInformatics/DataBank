import React from 'react';

import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

interface PortalLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default async function PortalLayout({ children, params }: PortalLayoutProps) {
  const t = await getTranslations(params.locale);
  return (
    <React.Fragment>
      <header>
        <h1>Header</h1>
      </header>
      <main className="container">{children}</main>
    </React.Fragment>
  );
}
