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
    <div className="flex h-full w-full flex-col">
      <Heading title="Shared Datasets" />
      <div className="overflow-hidden">
        {availableDatasets ? (
          <ul className="h-full overflow-x-visible overflow-y-scroll rounded-sm shadow">
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
    </div>
  );
});
