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
  isPublic,
  license,
  managerIds,
  name,
  status,
  updatedAt
}: DatasetCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const deleteDataset = useDeleteDataset();
  const viewDatasetUrl = isPublic ? `/public/dataset/` : `/portal/datasets/`;
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Card.Description>
            {t('datasetDescription')}: {description}
          </Card.Description>
          {status !== 'Success' ? (
            <Badge variant={status === 'Fail' ? 'destructive' : 'secondary'}>{status}</Badge>
          ) : (
            <></>
          )}
        </Card.Header>
        <Card.Content>
          <ul>
            <li key={id}>
              {t('datasetId')}: {id}
            </li>
            <li key={id + 'createdAt'}>
              {t('createdAt')}: {createdAt.toString()}
            </li>
            <li key={id + 'updatedAt'}>
              {t('updatedAt')}: {updatedAt.toString()}
            </li>
            <li key={id + license}>
              {t('datasetLicense')}: {license}
            </li>
            <li key={id + 'managerIds'}>
              {t('managerId')}:{' '}
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
            onClick={() => void navigate({ to: viewDatasetUrl + `${id}` })}
          >
            {isManager ? t('manageDataset') : t('viewDataset')}
          </Button>

          <Button hidden={status !== 'Fail' || !isManager} variant={'danger'} onClick={() => deleteDataset(id)}>
            {t('delete')}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default DatasetCard;
