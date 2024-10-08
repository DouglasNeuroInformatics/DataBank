/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { type RouteObject, useNavigate, useParams } from 'react-router-dom';

import { LoadingFallback } from '@/components';

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
  const params = useParams();
  const [project, setProject] = useState<null | Project>(null);
  const notifications = useNotificationsStore();
  const [isManager, setIsManager] = useState(false);

  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);

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
      .get<Project>(`/v1/projects/${params.projectId}`)
      .then((response) => {
        setProject(response.data);
      })
      .catch(console.error);

    axios
      .get<boolean>(`/v1/projects/is-manager/${params.projectId}`)
      .then((response) => {
        setIsManager(response.data);
      })
      .catch(console.error);

    axios
      .get<DatasetCardProps[]>(`/v1/projects/datasets/${params.projectId}`)
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch(console.error);
  }, [params.projectId]);

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
                      navigate(`/portal/manageProjectUsers`, {
                        state: {
                          projectId: project.id,
                          userIds: project.userIds
                        }
                      })
                    }
                  >
                    {t('manageProjectUsers')}
                  </Button>

                  <Button className="m-2" variant={'danger'} onClick={() => deleteProject(params.projectId!)}>
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
              <div className="bg-card text-muted-foreground m-3 rounded-md border tracking-tight shadow-sm">
                <Card>
                  <Card.Header>
                    <Card.Title>{`${t('projectDatasets')}`}</Card.Title>
                    <Button
                      className="m-2"
                      variant={'secondary'}
                      onClick={() => navigate(`/portal/project/addDataset/${project.id}`)}
                    >
                      Add Dataset to Current Project
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
                  onClick={() => navigate(`/portal/project/edit-info/${project.id}`)}
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
  path: 'project/:projectId',
  element: <ViewOneProjectPage />
};
