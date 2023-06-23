import { useCallback, useEffect, useMemo, useState } from 'react';

import { TDataset } from '@databank/types';
import { TableColumn, TableEntry, useDownload } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { unparse } from 'papaparse';
import { Primitive } from 'type-fest';

export type TableData<T extends TDataset, TEntry extends TableEntry = { [K in keyof T['columns']]: unknown }> = {
  columns: TableColumn<TEntry>[];
  data: Record<string, Primitive>[];
};

export function useDataset<T extends TDataset = TDataset>(id: string) {
  const dl = useDownload();
  const [dataset, setDataset] = useState<T | null>(null);

  useEffect(() => {
    axios
      .get<T>(`/v1/datasets/${id}`)
      .then((response) => setDataset(response.data))
      .catch(console.error);
  }, [id]);

  const download = useCallback(
    (format: 'CSV' | 'TSV') => {
      if (!dataset) {
        throw new Error(`Expected dataset with ID '${id}' is undefined`);
      }
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
      dl(filename, () => {
        return Promise.resolve(unparse(matrix, { delimiter: format === 'TSV' ? '\t' : ',' }));
      });
    },
    [dl, dataset]
  );

  const table: TableData<T> | null = useMemo(() => {
    if (!dataset) {
      return null;
    }
    return {
      columns: Object.keys(dataset.columns).map((col) => ({ label: col, field: col })),
      data: Object.values(dataset.data)
    };
  }, [dataset]);

  if (!dataset || !table) {
    return { dataset: null, download: null, table };
  }

  return { dataset, download, table };
}
