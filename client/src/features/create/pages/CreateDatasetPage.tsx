import { useTranslation } from 'react-i18next';

import { type CreateDatasetData } from '../components/CreateDatasetForm';
import { DatasetDropzone } from '../components/DatasetDropzone';

import { Heading } from '@/components/Heading';

export const CreateDatasetPage = () => {
  const { t } = useTranslation();

  const handleSubmit = (data: CreateDatasetData) => {
    console.log(data);
  };

  return (
    <div className="flex h-full flex-col">
      <Heading title={t('createDataset')} />
      <div className="flex flex-grow items-center justify-center">
        <DatasetDropzone />
      </div>
    </div>
  );
};
