import React from 'react';

import { SearchBar } from '@douglasneuroinformatics/react-components';

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
    <div className="grid grid-cols-4">
      <div className="col-span-1">
        <h3>Your Datasets</h3>
      </div>
      <div className="col-span-3">
        <SearchBar />
        <Table />
      </div>
    </div>
  );
};

export default DatasetPage;
