import React from 'react';

import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

interface PortalPageProps {
  params: {
    locale: Locale;
  };
}

export default async function PortalPage({ params }: PortalPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <div>
      <h1>Portal</h1>
    </div>
  );
}
