import { useCallback, useEffect, useMemo, useState } from 'react';

import { TDataset } from '@databank/types';
import { Button, Dropdown, Table, TableColumn, useDownload } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { unparse } from 'papaparse';
import { useParams } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { Heading } from '@/components/Heading';
import { withTransition } from '@/utils/withTransition';

export const SharedDatasetPage = withTransition(() => {
  const [dataset, setDataset] = useState<TDataset>();
  const params = useParams();
  const download = useDownload();

  const handleDownload = useCallback(
    (dataset: TDataset, format: 'CSV' | 'TSV') => {
      const cols = Object.keys(dataset.columns);
      const matrix: any[][] = [cols];
      for (const item of Object.values(dataset.data)) {
        const row: any[] = [];
        for (const col of cols) {
          row.push(item[col]);
        }
        matrix.push(row);
      }
      const filename = dataset.name + '.' + format.toLowerCase();
      download(filename, () => {
        return Promise.resolve(unparse(matrix, { delimiter: format === 'TSV' ? '\t' : ',' }));
      });
    },
    [download]
  );

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
      <Heading subtitle={dataset.description} title={dataset.name}>
        <div className="flex gap-3">
          <Button
            label="Contact Owner"
            variant="secondary"
            onClick={() => {
              window.open(`mailto:${dataset.owner.email}?subject=${encodeURIComponent(dataset.name)}`, '_self');
            }}
          />
          <Dropdown
            className="w-min"
            options={['CSV', 'TSV']}
            title="Download"
            onSelection={(option) => handleDownload(dataset, option)}
          />
        </div>
      </Heading>
      <div className="flex-grow-0 overflow-hidden pb-3">
        <Table columns={columns} data={data} />
      </div>
    </>
  ) : (
    <SuspenseFallback />
  );
});
