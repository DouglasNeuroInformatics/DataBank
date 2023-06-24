import { type CreateDatasetData, CreateDatasetForm } from '../components/CreateDatasetForm';

import { Heading } from '@/components/Heading';

export const CreateDatasetPage = () => {
  const handleSubmit = (data: CreateDatasetData) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col">
      <Heading title="Create Dataset" />
      <CreateDatasetForm onSubmit={handleSubmit} />
    </div>
  );
};
