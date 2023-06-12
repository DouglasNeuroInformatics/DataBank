import React from 'react';

import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

interface IndexPageProps {
  params: {
    locale: Locale;
  };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <React.Fragment>
      <h1>Portal</h1>
    </React.Fragment>
  );
}
