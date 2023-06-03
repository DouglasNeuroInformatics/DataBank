import React from 'react';

import { uploadDataset } from './actions';

import { FileUpload } from '@/components/FileUpload';
import { PageHeading } from '@/components/PageHeading';
import { type Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

interface DatasetPageProps {
  params: {
    locale: Locale;
  };
}

const DatasetPage = async ({ params }: DatasetPageProps) => {
  const t = await getTranslations(params.locale);
  return (
    <div>
      <PageHeading text="Manage Datasets" />
      <FileUpload
        action={uploadDataset}
        description="Please ensure that your file is in CSV format"
        inputName="file"
        submitBtnLabel={t.submit}
      />
    </div>
  );
};

export default DatasetPage;
