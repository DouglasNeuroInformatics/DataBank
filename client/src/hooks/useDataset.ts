import { useCallback, useEffect, useMemo, useState } from 'react';

import { DatasetEntry, TDataset } from '@databank/types';
import { TableColumn, useDownload } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { unparse } from 'papaparse';

export type TableData<T extends DatasetEntry> = {
  columns: TableColumn<T>[];
  data: T[];
};

export function useDataset<
  TEntry extends DatasetEntry = DatasetEntry,
  TData extends TDataset<TEntry> = TDataset<TEntry>
>(id: string) {
  const dl = useDownload();
  const [dataset, setDataset] = useState<TData | null>(null);

  const revalidate = () => {
    axios
      .get<TData>(`/v1/datasets/${id}`)
      .then((response) => setDataset(response.data))
      .catch(console.error);
  };

  useEffect(() => {
    revalidate();
  }, [id]);

  const download = useCallback(
    (format: 'CSV' | 'TSV') => {
      if (!dataset) {
        throw new Error(`Expected dataset with ID '${id}' is undefined`);
      }
      const columnNames = dataset.columns.map(({ name }) => name);
      const matrix: any[][] = [columnNames];
      for (const item of dataset.data) {
        const row: any[] = [];
        for (const col of columnNames) {
          row.push(item[col]);
        }
        matrix.push(row);
      }
      const filename = dataset.name + '.' + format.toLowerCase();
      dl(filename, () => {
        return Promise.resolve(unparse(matrix, { delimiter: format === 'TSV' ? '\t' : ',' }));
      });
    },
    [dl, dataset]
  );

  const table: TableData<TEntry> | null = useMemo(() => {
    if (!dataset) {
      return null;
    }
    return {
      columns: dataset.columns.map((column) => ({ label: column.name, field: column.name })),
      data: dataset.data
    };
  }, [dataset]);

  if (!dataset || !table) {
    return { dataset: null, download: null, table, revalidate };
  }

  return { dataset, download, table, revalidate };
}
