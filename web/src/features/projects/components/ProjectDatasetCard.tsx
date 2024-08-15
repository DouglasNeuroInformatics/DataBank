import React from 'react';

import { Badge } from '@douglasneuroinformatics/libui/components';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

export type ProjectDatasetCardProps = {
  createdAt: Date;
  description: null | string;
  id: string;
  isManager: boolean;
  license: string;
  managerIds: string[];
  name: string;
  updatedAt: Date;
};

const ProjectDatasetCard = ({
  createdAt,
  description,
  id,
  isManager,
  license,
  managerIds,
  name,
  updatedAt
}: ProjectDatasetCardProps) => {
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
          {isManager ? (
            <Button variant={'primary'} onClick={() => navigate(`/portal/project/dataset/${id}`)}>
              {t('manageDataset')}
            </Button>
          ) : (
            <Button variant={'primary'} onClick={() => navigate(`/portal/project/dataset/${id}`)}>
              {t('viewDataset')}
            </Button>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};

export default ProjectDatasetCard;
