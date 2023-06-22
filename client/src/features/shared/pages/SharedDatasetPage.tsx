import { useEffect, useMemo, useState } from 'react';

import { TDataset } from '@databank/types';
import { Table, TableColumn } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { Heading } from '@/components/Heading';

export const SharedDatasetPage = () => {
  const [dataset, setDataset] = useState<TDataset>();
  const params = useParams();

  const columns: TableColumn<Record<string, any>>[] = useMemo(() => {
    if (!dataset) {
      return [];
    }
    return Object.keys(dataset.columns).map((col) => ({ label: col, field: col }));
  }, [dataset]);

  const data = useMemo(() => {
    if (!dataset) {
      return [];
    }
    return Object.values(dataset.data);
  }, [dataset]);

  useEffect(() => {
    void fetchDataset();
  }, []);

  const fetchDataset = async () => {
    const response = await axios.get<TDataset>(`/v1/datasets/${params.id!}`);
    setDataset(response.data);
  };

  return dataset ? (
    <>
      <Heading title={dataset.name} />
      <div className="flex-grow-0 overflow-hidden pb-3">
        <Table columns={columns} data={data} />
      </div>
    </>
  ) : (
    <SuspenseFallback />
  );
};
