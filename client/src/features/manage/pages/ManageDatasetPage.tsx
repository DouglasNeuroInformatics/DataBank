import { Table } from '@douglasneuroinformatics/react-components';
import { useParams } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { useDataset } from '@/hooks/useDataset';

export const ManageDatasetPage = () => {
  const params = useParams();
  const { dataset, table } = useDataset(params.id!);

  return dataset ? (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow overflow-hidden">
        <Table columns={table.columns} data={table.data} />
      </div>
    </div>
  ) : (
    <SuspenseFallback />
  );
};
