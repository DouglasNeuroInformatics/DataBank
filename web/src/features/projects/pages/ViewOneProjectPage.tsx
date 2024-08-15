/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { type RouteObject, useLocation, useNavigate } from 'react-router-dom';

import { LoadingFallback } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

import ProjectDatasetCard from '../components/ProjectDatasetCard';

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
  const notifications = useNotificationsStore();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);

  const removeUser = () => {
    //
  };

  const addUser = () => {
    //
  };

  const deleteProject = (projectId: string) => {
    axios
      .delete(`/v1/projects/${projectId}`)
      .then(() => {
        notifications.addNotification({
          type: 'success',
          message: `Project with Id ${projectId} has been deleted`
        });
        navigate('/portal/projects');
      })
      .catch(console.error);
  };

  useEffect(() => {
    axios
      .get<Project>(`/v1/projects/${location.state}`)
      .then((response) => {
        setProject(response.data);
      })
      .catch(console.error);

    axios
      .get<DatasetCardProps[]>(`/v1/projects/datasets/${location.state}`)
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
              <Card.Title>{`${t('projectName')}: ${project.name}`}</Card.Title>
              <Card.Description>{`${t('projectDescription')}: ${project.description}`}</Card.Description>
              <div className="flex justify-between">
                <Button className="m-2" variant={'secondary'} onClick={addUser}>
                  {t('addUser')}
                </Button>

                <Button className="m-2" variant={'secondary'} onClick={removeUser}>
                  {t('removeUser')}
                </Button>

                <Button className="m-2" variant={'danger'} onClick={() => deleteProject(project.id)}>
                  {t('deleteProject')}
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <ul>
                <li>{`${t('createdAt')}: ${project.createdAt.toString()}`}</li>
                <li>{`${t('updatedAt')}: ${project.updatedAt.toString()}`}</li>
                <li>{`${t('projectExternalId')}: ${project.externalId}`}</li>
              </ul>
              <div className="m-3 rounded-md border bg-card tracking-tight text-muted-foreground shadow-sm">
                <Card>
                  <Card.Header>
                    <Card.Title>{`${t('projectDatasets')}`}</Card.Title>
                    <Button
                      className="m-2"
                      variant={'secondary'}
                      onClick={() => navigate('/portal/project/addDataset')}
                    >
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
                              <ProjectDatasetCard
                                createdAt={datasetInfo.createdAt}
                                description={datasetInfo.description}
                                id={datasetInfo.id}
                                isManager={isManager}
                                license={datasetInfo.license}
                                managerIds={datasetInfo.managerIds}
                                name={datasetInfo.name}
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
              </div>
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
        </>
      ) : (
        <LoadingFallback />
      )}
    </>
  );
};

export const ViewOneProjectRoute: RouteObject = {
  path: 'project',
  element: <ViewOneProjectPage />
};
