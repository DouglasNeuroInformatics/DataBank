/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { type RouteObject, useLocation, useNavigate } from 'react-router-dom';

import { LoadingFallback } from '@/components';
import DatasetCard from '@/features/dataset/components/DatasetCard';
import { useAuthStore } from '@/stores/auth-store';

type Project = {
  createdAt: Date;
  datasets: string[];
  description: string;
  expiry: Date;
  externalId: string;
  id: string;
  name: string;
  updatedAt: Date;
  userIds: string[];
};

const ViewOneProjectPage = () => {
  // location contains the variable in the state of the navigate function
  const location = useLocation();
  const { currentUser } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);

  const removeUser = () => {
    //
  };

  const addUser = () => {
    //
  };

  const deleteProject = () => {
    //
  };

  useEffect(() => {
    axios
      .get<Project>(`/v1/projects/projects/${location.state}`)
      .then((response) => {
        setProject(response.data);
      })
      .catch(console.error);

    axios
      .get<DatasetCardProps[]>('/v1/projects/datasets')
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch(console.error);
  }, [location.state]);

  return (
    <>
      {project ? (
        <>
          <Card>
            <Card.Header>
              <Card.Title>{project.name}</Card.Title>
              <Card.Description>{project.description}</Card.Description>
              <>
                <Button className="m-2" variant={'secondary'} onClick={addUser}>
                  Add User
                </Button>

                <Button className="m-2" variant={'secondary'} onClick={removeUser}>
                  Remove User
                </Button>

                <Button className="m-2" variant={'danger'} onClick={deleteProject}>
                  Delete Project
                </Button>
              </>
            </Card.Header>
            <Card.Content>
              <ul>
                <li>Created at: {project.createdAt.toDateString()}</li>
                <li>Updated at: {project.updatedAt.toDateString()}</li>
                <li>External Id: {project.externalId}</li>
              </ul>
              <div className="m-3 rounded-md border bg-card tracking-tight text-muted-foreground shadow-sm"></div>
            </Card.Content>
            <Card.Footer>
              <>
                <Button
                  className="m-2"
                  variant={'primary'}
                  onClick={() => {
                    // navigate to edit project information page? with a form?
                    // submit button to change and back button to navigate back
                    return 'TODO';
                  }}
                >
                  Edit Project Information
                </Button>
              </>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title className="text-3xl">{t('projectDatasets')}</Card.Title>
              <Button className="m-2" variant={'secondary'} onClick={() => navigate('/portal/project/addDataset')}>
                Add Dataset to Current Project
              </Button>
            </Card.Header>
            <Card.Content>
              <ul>
                {datasetsInfoArray?.map((datasetInfo, i) => {
                  let isManager: boolean;
                  if (!currentUser?.id) {
                    isManager = false;
                  } else {
                    isManager = datasetInfo.managerIds.includes(currentUser.id);
                  }
                  return (
                    datasetInfo && (
                      <li key={i}>
                        <DatasetCard
                          createdAt={datasetInfo.createdAt}
                          datasetType={datasetInfo.datasetType}
                          description={datasetInfo.description}
                          id={datasetInfo.id}
                          isManager={isManager}
                          isReadyToShare={false}
                          license={datasetInfo.license}
                          managerIds={datasetInfo.managerIds}
                          name={datasetInfo.name}
                          permission={datasetInfo.permission}
                          updatedAt={datasetInfo.updatedAt}
                        />
                      </li>
                    )
                  );
                })}
              </ul>
            </Card.Content>
            <Card.Footer className="flex justify-between"></Card.Footer>
          </Card>
        </>
      ) : (
        <LoadingFallback />
      )}
    </>
  );
};

export const viewOneProjectRoute: RouteObject = {
  path: 'project',
  element: <ViewOneProjectPage />
};
