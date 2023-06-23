import { useEffect, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { DatasetCard } from '@/components/DatasetCard';
import { Heading } from '@/components/Heading';
import { withTransition } from '@/utils/withTransition';

export const SharedPage = withTransition(() => {
  const navigate = useNavigate();
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
        <ul className="divide-y divide-slate-200 rounded-sm shadow dark:divide-slate-700">
          {availableDatasets.map((dataset) => (
            <li key={dataset._id}>
              <DatasetCard dataset={dataset} onClick={({ _id }) => navigate(_id)} />
            </li>
          ))}
        </ul>
      ) : (
        <SuspenseFallback />
      )}
    </div>
  );
});
