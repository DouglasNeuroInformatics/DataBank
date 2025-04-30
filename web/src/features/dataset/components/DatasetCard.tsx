import type { DatasetCardProps } from '@databank/core';
import { Badge, Button, Card } from '@douglasneuroinformatics/libui/components';
import { useNavigate } from '@tanstack/react-router';

const DatasetCard = ({
  createdAt,
  description,
  id,
  isManager,
  license,
  managerIds,
  name,
  updatedAt
}: DatasetCardProps) => {
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
          <Button variant={'primary'} onClick={() => void navigate({ to: `/portal/datasets/${id}` })}>
            {isManager ? 'Manage Dataset' : 'View Dataset'}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default DatasetCard;
