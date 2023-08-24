import { Button, Dropdown, Table } from '@douglasneuroinformatics/react-components';
import { useParams } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { Heading } from '@/components/Heading';
import { useDataset } from '@/hooks/useDataset';

export const SharedDatasetPage = () => {
  const params = useParams();
  const { dataset, download, table } = useDataset(params.id!);

  return dataset ? (
    <div className="flex h-full w-full flex-col">
      <Heading subtitle={dataset.description} title={dataset.name}>
        <div className="flex gap-3">
          <Button
            className="whitespace-nowrap"
            label="Contact Owner"
            size="sm"
            variant="secondary"
            onClick={() => {
              window.open(`mailto:${dataset.owner.email}?subject=${encodeURIComponent(dataset.name)}`, '_self');
            }}
          />
          <Dropdown
            className="w-min whitespace-nowrap"
            options={['CSV', 'TSV', 'DICT']}
            size="sm"
            title="Download"
            onSelection={(option) => download(option)}
          />
        </div>
      </Heading>
      <div className="flex-grow overflow-hidden">
        <Table columns={table.columns} data={table.data} />
      </div>
    </div>
  ) : (
    <SuspenseFallback />
  );
};
