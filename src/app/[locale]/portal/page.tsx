import React from 'react';

import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

interface PortalPageProps {
  params: {
    locale: Locale;
  };
}

const PortalPage = async ({ params }: PortalPageProps) => {
  const t = await getTranslations(params.locale);
  return (
    <div className="py-10">
      <h1>Hello World</h1>
    </div>
  );
};

export default PortalPage;
