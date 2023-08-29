import { Button, Dropdown, useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { DataTable } from '@/components/DataTable';
import { Heading } from '@/components/Heading';
import { useDataset } from '@/hooks/useDataset';

export const ManageDatasetPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const notifications = useNotificationsStore();
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
            options={['CSV', 'TSV', 'DICT']}
            size="sm"
            title="Download"
            onSelection={(option) => { download(option); }}
          />
          <Dropdown
            className="w-min whitespace-nowrap"
            options={['Delete Dataset']}
            size="sm"
            title="More"
            onSelection={() => {
              axios
                .delete(`/v1/datasets/${params.id!}`)
                .then(() => {
                  notifications.addNotification({ type: 'success' });
                  navigate('..');
                })
                .catch(console.error);
            }}
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
