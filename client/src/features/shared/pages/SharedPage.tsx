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
        <ul className="divide-y divide-slate-300 rounded-sm shadow">
          {availableDatasets.map((item) => (
            <li>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <SuspenseFallback />
      )}
    </div>
  );
};
