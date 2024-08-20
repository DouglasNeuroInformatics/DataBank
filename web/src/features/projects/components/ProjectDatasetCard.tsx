import React from 'react';

import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type ProjectDatasetCardProps = {
  createdAt: Date;
  description: null | string;
  id: string;
  license: string;
  name: string;
  updatedAt: Date;
};

const ProjectDatasetCard = ({ createdAt, description, id, license, name, updatedAt }: ProjectDatasetCardProps) => {
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
            <li key={id}>Dataset Id: {id}</li>
            <li key={id + 'createdAt'}>Created at: {createdAt.toString()}</li>
            <li key={id + 'updatedAt'}>Updated at: {updatedAt.toString()}</li>
            <li key={id + license}>Licence: {license}</li>
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          <Button variant={'primary'} onClick={() => navigate(`/portal/project/dataset/${id}`)}>
            {t('manageDataset')}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default ProjectDatasetCard;
