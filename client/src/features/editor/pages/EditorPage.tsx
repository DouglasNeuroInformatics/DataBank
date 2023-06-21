import { useState } from 'react';

import { CreateDatasetData, CreateDatasetModal } from '../components/CreateDatasetModal';
import { EmptyState } from '../components/EmptyState';

import { Heading } from '@/components/Heading';

export const EditorPage = () => {
  const [isCreateDatasetOpen, setIsCreateDatasetOpen] = useState(false);

  const handleSubmitDataset = (data: CreateDatasetData) => {
    alert(JSON.stringify(data));
  };

  return (
    <div className="flex h-full flex-col">
      <Heading title="Your Datasets" />
      <div className="grid flex-grow grid-cols-4 gap-3">
        <div className="col-span-1 space-y-3 border p-2">
          <button onClick={() => setIsCreateDatasetOpen(true)}>Create a New Dataset</button>
        </div>
        <div className="col-span-3 border p-2">
          <EmptyState />
        </div>
      </div>
      <CreateDatasetModal
        open={isCreateDatasetOpen}
        onClose={() => setIsCreateDatasetOpen(false)}
        onSubmit={handleSubmitDataset}
      />
    </div>
  );
};
