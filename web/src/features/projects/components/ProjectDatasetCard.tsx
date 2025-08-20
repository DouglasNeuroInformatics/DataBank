import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

type ProjectDatasetCardProps = {
  createdAt: Date;
  datasetId: string;
  description: null | string;
  isManager: boolean;
  license: string;
  name: string;
  projectId: string;
  updatedAt: Date;
};

const ProjectDatasetCard = ({
  createdAt,
  datasetId,
  description,
  isManager,
  license,
  name,
  projectId,
  updatedAt
}: ProjectDatasetCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>
        <Card.Content>
          <ul>
            <li key={datasetId}>
              {t('datasetId')}: {datasetId}
            </li>
            <li key={datasetId + 'createdAt'}>
              {t('createdAt')}: {createdAt.toString()}
            </li>
            <li key={datasetId + 'updatedAt'}>
              {t('updatedAt')}: {updatedAt.toString()}
            </li>
            <li key={datasetId + license}>
              {t('datasetLicense')}: {license}
            </li>
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          <Button
            variant={'primary'}
            onClick={() => void navigate({ to: `/portal/projects/view-project-dataset/${projectId}/${datasetId}` })}
          >
            {isManager ? t('manageProjectDataset') : t('viewProjectDataset')}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default ProjectDatasetCard;
