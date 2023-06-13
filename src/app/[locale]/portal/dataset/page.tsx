import React from 'react';

import { Table } from '@/components/Table';
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
    <div className="grid md:grid-cols-2">
      <div>
        <h3>Your Datasets</h3>
      </div>
      <div>
        <Table />
      </div>
    </div>
  );
};

export default DatasetPage;
