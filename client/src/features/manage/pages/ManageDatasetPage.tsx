import { Button, Dropdown } from '@douglasneuroinformatics/react-components';
import { useParams } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { DataTable } from '@/components/DataTable';
import { Heading } from '@/components/Heading';
import { useDataset } from '@/hooks/useDataset';

export const ManageDatasetPage = () => {
  const params = useParams();
  const { dataset, download, revalidate } = useDataset(params.id!);

  return dataset ? (
    <div className="flex h-full w-full flex-col">
      <Heading subtitle={dataset.description} title={dataset.name}>
        <div className="flex gap-3">
          <Button
            className="whitespace-nowrap"
            label="Add Rows"
            size="sm"
            variant="secondary"
            onClick={() => {
              // eslint-disable-next-line no-alert
              alert('Work in Progress!');
            }}
          />
          <Dropdown
            className="w-min whitespace-nowrap"
            options={['CSV', 'TSV']}
            size="sm"
            title="Download"
            onSelection={(option) => download(option)}
          />
        </div>
      </Heading>
      <div className="flex-grow overflow-hidden">
        <DataTable dataset={dataset} revalidate={revalidate} />
      </div>
    </div>
  ) : (
    <SuspenseFallback />
  );
};
