import React from 'react';

import { uploadDataset } from './actions';

import { FileUpload } from '@/components/FileUpload';
import { PageHeading } from '@/components/PageHeading';

const DatasetPage = () => {
  return (
    <div>
      <PageHeading text="Manage Datasets" />
      <FileUpload action={uploadDataset} inputName="file" />
    </div>
  );
};

export default DatasetPage;
