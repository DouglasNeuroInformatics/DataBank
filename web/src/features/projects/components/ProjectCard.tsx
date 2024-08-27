import React from 'react';

import { Badge } from '@douglasneuroinformatics/libui/components';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useNavigate } from 'react-router-dom';

export type ProjectInfo = {
  createdAt: Date;
  description: string;
  expiry: Date;
  externalId: string;
  id: string;
  name: string;
  updatedAt: Date;
  userIds: string[];
};

export type ProjectCardProps = { isProjectManager: boolean } & ProjectInfo;

export const ProjectCard = ({
  createdAt,
  description,
  expiry,
  externalId,
  id,
  isProjectManager,
  name,
  updatedAt,
  userIds
}: ProjectCardProps) => {
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
            <li>Project Id: {id}</li>
            <li>External Id: {externalId}</li>
            <li>Created at: {createdAt.toString()}</li>
            <li>Updated at: {updatedAt.toString()}</li>
            <li>Expiry: {expiry.toString()}</li>
            <li>
              UserId:{' '}
              {userIds.map((element) => {
                return (
                  <Badge key={`UserId-${element}`} variant={'secondary'}>
                    {element}
                  </Badge>
                );
              })}
            </li>
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          {isProjectManager ? (
            <Button variant={'primary'} onClick={() => navigate(`/portal/project/${id}`)}>
              Manage Project
            </Button>
          ) : (
            <Button variant={'primary'} onClick={() => navigate(`/portal/project/${id}`)}>
              View Project
            </Button>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};
