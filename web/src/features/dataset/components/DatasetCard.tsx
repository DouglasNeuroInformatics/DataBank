import React from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Badge } from '@douglasneuroinformatics/libui/components';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';

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
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>
        <Card.Content>
          <ul>
            <li>Dataset Id: {id}</li>
            <li>Created at:{createdAt.toDateString()}</li>
            <li>Updated at: {updatedAt.toDateString()}</li>
            <li>Licence: {license}</li>
            <li>
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
            <Button
              variant={'primary'}
              onClick={() => {
                alert('Entering Manage Dataset Page');
              }}
            >
              Manage Dataset
            </Button>
          ) : (
            <Button
              variant={'primary'}
              onClick={() => {
                alert('Entering View Dataset Page');
              }}
            >
              View Dataset
            </Button>
          )}
          {isManager && (
            <Button
              variant={'secondary'}
              onClick={() => {
                alert('Added a new Manager');
              }}
            >
              Add Manager
            </Button>
          )}
          {isManager && (
            <Button
              variant={'secondary'}
              onClick={() => {
                alert('Removed a manager');
              }}
            >
              Remove Manager
            </Button>
          )}
          {isManager && (
            <Button
              variant={'danger'}
              onClick={() => {
                alert('Deleting Dataset!');
              }}
            >
              Delete Dataset
            </Button>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};

export default DatasetCard;
