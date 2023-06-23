import { Heading } from '@/components/Heading';

export type CreateDatasetData = {
  name: string;
  description?: string;
};

export const CreateDatasetPage = () => {
  return (
    <div>
      <Heading title="Create Dataset" />
    </div>
  );
};
