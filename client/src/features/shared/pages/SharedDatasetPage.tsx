import { useEffect } from 'react';

import axios from 'axios';
import { useParams } from 'react-router-dom';

import { Heading } from '@/components/Heading';

export const SharedDatasetPage = () => {
  const params = useParams();

  const fetchDataset = async () => {
    const response = await axios.get(`/v1/datasets/${params.id!}`);
    console.log(response.data);
  };

  useEffect(() => {
    void fetchDataset();
  }, []);

  return (
    <div>
      <Heading title="Shared" />
    </div>
  );
};
