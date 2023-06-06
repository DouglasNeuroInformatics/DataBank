'use client';

import React from 'react';

import { useNotificationsStore } from '@douglasneuroinformatics/react-components';

import { uploadDataset } from './actions';

import { FileUpload } from '@/components/FileUpload';
import { PageHeading } from '@/components/PageHeading';
import { useClientTranslations } from '@/hooks/useClientTranslations';

const DatasetPage = () => {
  const t = useClientTranslations();
  const { addNotification } = useNotificationsStore();

  React.useEffect(() => {
    addNotification({ type: 'success', message: 'Works!' });
  }, []);
  
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
