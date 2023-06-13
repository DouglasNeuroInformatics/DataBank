import React from 'react';

import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

interface DatasetPageProps {
  params: {
    locale: Locale;
  };
}

const DatasetPage = async ({ params }: DatasetPageProps) => {
  const t = await getTranslations(params.locale);
  return (
    <div>
      <h1>Dataset Page</h1>
    </div>
  );
};

export default DatasetPage;
