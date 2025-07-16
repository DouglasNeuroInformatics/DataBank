import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

type AddProjectDatasetCardProps = {
  createdAt: Date;
  datasetId: string;
  description: null | string;
  license: string;
  name: string;
  projectId: string;
  updatedAt: Date;
};

const AddProjectDatasetCard = ({
  createdAt,
  datasetId,
  description,
  license,
  name,
  projectId,
  updatedAt
}: AddProjectDatasetCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  return (
    <>
      <Card className="my-3 h-[300px]">
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>
        <Card.Content>
          <ul>
            <li key={datasetId}>Dataset datasetId: {datasetId}</li>
            <li key={datasetId + 'createdAt'}>Created at: {createdAt.toString()}</li>
            <li key={datasetId + 'updatedAt'}>Updated at: {updatedAt.toString()}</li>
            <li key={datasetId + license}>Licence: {license}</li>
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          <Button
            variant={'primary'}
            onClick={() => void navigate({ to: `/portal/projects/add-columns/${projectId}/${datasetId}` })}
          >
            {t('selectDataset')}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default AddProjectDatasetCard;
