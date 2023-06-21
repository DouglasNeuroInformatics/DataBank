import { useEffect, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { Heading } from '@/components/Heading';

export const SharedDatasetPage = () => {
  const [dataset, setDataset] = useState<DatasetInfo>();
  const params = useParams();

  const fetchDataset = async () => {
    const response = await axios.get<DatasetInfo>(`/v1/datasets/${params.id!}`);
    setDataset(response.data);
  };

  useEffect(() => {
    void fetchDataset();
  }, []);

  return dataset ? (
    <div>
      <Heading title={dataset.name} />
    </div>
  ) : (
    <SuspenseFallback />
  );
};
