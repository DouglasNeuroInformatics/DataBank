import type { DatasetCardProps } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useNavigate } from 'react-router-dom';

const PublicDatasetCard = ({ createdAt, description, id, license, name, updatedAt }: DatasetCardProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>
        <Card.Content>
          <ul>
            <li key={id}>Dataset Id: {id}</li>
            <li key={id + 'createdAt'}>Created at: {createdAt.toString()}</li>
            <li key={id + 'updatedAt'}>Updated at: {updatedAt.toString()}</li>
            <li key={id + license}>Licence: {license}</li>
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          <Button variant={'primary'} onClick={() => navigate(`/public/dataset/${id}`)}>
            View Dataset
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default PublicDatasetCard;
