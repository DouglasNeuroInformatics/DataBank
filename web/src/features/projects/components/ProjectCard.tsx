import React from 'react';

import { Badge } from '@douglasneuroinformatics/libui/components';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';

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

// use effect:
// the current user will send a request to the backend with its currentUserId
// the backend will determine if the user is a manager of the project and send the
// object back for the frontend to render

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
            <li>Created at: {createdAt.toDateString()}</li>
            <li>Updated at: {updatedAt.toDateString()}</li>
            <li>Expiry: {expiry.toDateString()}</li>
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
            <Button
              variant={'primary'}
              onClick={() => {
                alert('Entering Manage Project Page');
              }}
            >
              Manage Project
            </Button>
          ) : (
            <Button
              variant={'primary'}
              onClick={() => {
                alert('Entering View Project Page');
              }}
            >
              View Project
            </Button>
          )}
          {isProjectManager && (
            <Button
              variant={'secondary'}
              onClick={() => {
                alert('Added a new User');
              }}
            >
              Add User
            </Button>
          )}
          {isProjectManager && (
            <Button
              variant={'secondary'}
              onClick={() => {
                alert('Removed a User');
              }}
            >
              Remove User
            </Button>
          )}
          {isProjectManager && (
            <Button
              variant={'danger'}
              onClick={() => {
                alert('Deleting Project!');
              }}
            >
              Delete Project
            </Button>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};
