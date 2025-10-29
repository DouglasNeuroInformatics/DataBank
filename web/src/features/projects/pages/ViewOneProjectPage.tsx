/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import type { $DatasetCardProps } from '@databank/core';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';

import { LoadingFallback } from '@/components';

import ProjectDatasetCard from '../components/ProjectDatasetCard';

type Project = {
  createdAt: Date;
  datasets: string[];
  description: string;
  expiry: Date;
  externalId?: string;
  id: string;
  name: string;
  updatedAt: Date;
  userIds: string[];
};

const ViewOneProjectPage = () => {
  const { projectId } = useParams({ strict: false });
  const [project, setProject] = useState<null | Project>(null);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const [isManager, setIsManager] = useState(false);

  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const [datasetsInfoArray, setDatasetsInfoArray] = useState<$DatasetCardProps[] | null>(null);

  const deleteProject = useDestructiveAction((projectId: string) => {
    axios
      .delete(`/v1/projects/${projectId}`)
      .then(() => {
        addNotification({
          type: 'success',
          message: `Project with Id ${projectId} has been deleted`
        });
        void navigate({ to: '/portal/projects' });
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('deleteProjectFailure'),
          type: 'error'
        });
      });
  });

  useEffect(() => {
    axios
      .get<Project>(`/v1/projects/${projectId}`)
      .then((response) => {
        setProject(response.data);
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('fetchProjectFailure'),
          type: 'error'
        });
      });

    axios
      .get<boolean>(`/v1/projects/is-manager/${projectId}`)
      .then((response) => {
        setIsManager(response.data);
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('isProjectManagerFailure'),
          type: 'error'
        });
      });

    axios
      .get<$DatasetCardProps[]>(`/v1/projects/datasets/${projectId}`)
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('fetchProjectDatasetsFailure'),
          type: 'error'
        });
      });
  }, [projectId]);

  return (
    <>
      {project ? (
        <>
          <Card>
            <Card.Header>
              <Card.Title>{`${t('projectName')}: ${project.name}`}</Card.Title>
              <Card.Description>{`${t('projectDescription')}: ${project.description}`}</Card.Description>
              {isManager && (
                <div className="flex justify-between">
                  <Button
                    className="m-2"
                    variant={'secondary'}
                    onClick={() =>
                      void navigate({
                        to: `/portal/projects/manage-users`,
                        search: {
                          projectId: project.id,
                          userIds: project.userIds
                        }
                      })
                    }
                  >
                    {t('manageProjectUsers')}
                  </Button>

                  <Button className="m-2" variant={'danger'} onClick={() => deleteProject(projectId!)}>
                    {t('deleteProject')}
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Content>
              <ul>
                <li>{`${t('createdAt')}: ${project.createdAt.toString()}`}</li>
                <li>{`${t('updatedAt')}: ${project.updatedAt.toString()}`}</li>
                <li>{`${t('projectExternalId')}: ${project.externalId}`}</li>
                <li>{`${t('projectExpiry')}: ${project.expiry.toString()}`}</li>
              </ul>
              <div className="bg-card text-muted-foreground shadow-xs m-3 rounded-md border tracking-tight">
                <Card>
                  <Card.Header>
                    <Card.Title>{`${t('projectDatasets')}`}</Card.Title>
                    <Button
                      className="m-2"
                      variant={'secondary'}
                      onClick={() => void navigate({ to: `/portal/projects/add-dataset/${project.id}` })}
                    >
                      {t('addDatasetToProject')}
                    </Button>
                  </Card.Header>
                  <Card.Content>
                    <ul>
                      {datasetsInfoArray?.map((datasetInfo, i) => {
                        return (
                          datasetInfo && (
                            <li key={i}>
                              <ProjectDatasetCard
                                createdAt={datasetInfo.createdAt}
                                datasetId={datasetInfo.id}
                                description={datasetInfo.description}
                                isManager={isManager}
                                license={datasetInfo.license}
                                name={datasetInfo.name}
                                projectId={project.id}
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
                  onClick={() =>
                    void navigate({
                      to: `/portal/projects/edit-info/${project.id}`,
                      search: {
                        name: project.name,
                        description: project.description,
                        externalId: project.externalId,
                        expiryDate: project.expiry
                      }
                    })
                  }
                >
                  {t('editProjectInfo')}
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

export { ViewOneProjectPage };
