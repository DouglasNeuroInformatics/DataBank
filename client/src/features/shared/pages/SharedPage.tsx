import { useEffect, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import axios from 'axios';

import { SuspenseFallback } from '@/components';
import { Heading } from '@/components/Heading';

export const SharedPage = () => {
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>();

  const fetchAvailable = async () => {
    const response = await axios.get<DatasetInfo[]>('/v1/datasets/available');
    setAvailableDatasets(response.data);
  };

  useEffect(() => {
    void fetchAvailable();
  }, []);

  return (
    <div>
      <Heading title="Shared Datasets" />
      {availableDatasets ? (
        <div className="rounded-sm">
          {availableDatasets.map((item) => (
            <div>{JSON.stringify(item)}</div>
          ))}
        </div>
      ) : (
        <SuspenseFallback />
      )}
    </div>
  );
};
