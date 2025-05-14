import type { DatasetCardProps } from '@databank/core';
import { Badge, Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

import { useDeleteDataset } from '../hooks/useDeleteDataset';

const DatasetCard = ({
  createdAt,
  description,
  id,
  isManager,
  license,
  managerIds,
  name,
  status,
  updatedAt
}: DatasetCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const deleteDataset = useDeleteDataset();
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Card.Description>{description}</Card.Description>
          <Badge variant={status === 'Fail' ? 'destructive' : status === 'Processing' ? 'secondary' : 'default'}>
            {status}
          </Badge>
        </Card.Header>
        <Card.Content>
          <ul>
            <li key={id}>Dataset Id: {id}</li>
            <li key={id + 'createdAt'}>Created at: {createdAt.toString()}</li>
            <li key={id + 'updatedAt'}>Updated at: {updatedAt.toString()}</li>
            <li key={id + license}>Licence: {license}</li>
            <li key={id + 'managerIds'}>
              ManagerId:{' '}
              {managerIds.map((element) => {
                return (
                  <Badge key={`managerId-${element}`} variant={'secondary'}>
                    {element}
                  </Badge>
                );
              })}
            </li>
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          <Button
            disabled={status !== 'Success'}
            variant={'primary'}
            onClick={() => void navigate({ to: `/portal/datasets/${id}` })}
          >
            {isManager ? t('manageDataset') : t('viewDataset')}
          </Button>

          {/* onClick delete dataset */}
          <Button hidden={status !== 'Fail' || !isManager} variant={'danger'} onClick={() => deleteDataset(id)}>
            {t('delete')}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default DatasetCard;
