/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { type RouteObject, useNavigate } from 'react-router-dom';

import { LoadingFallback } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

import { ProjectCard, type ProjectCardProps } from '../components/ProjectCard';

const ViewProjectsPage = () => {
  const { currentUser } = useAuthStore();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const notifications = useNotificationsStore();

  const [projectsInfoArray, setProjectsInfoArray] = useState<null | ProjectCardProps[]>(null);

  useEffect(() => {
    axios
      .get<ProjectCardProps[]>('/v1/projects')
      .then((response) => {
        setProjectsInfoArray(response.data);
      })
      .catch(console.error);
  }, []);

  const handleCreateProject = () => {
    if (currentUser?.datasetId.length && currentUser?.datasetId.length > 0) {
      navigate('/portal/createProject');
    } else {
      notifications.addNotification({
        type: 'error',
        message: 'Please upload your own dataset before creating a project!'
      });
    }
  };

  return projectsInfoArray ? (
    <Card>
      <Card.Header>
        <Card.Title className="text-3xl">{t('projects')}</Card.Title>
        {
          <Button className="m-2" variant={'secondary'} onClick={handleCreateProject}>
            Create New Project
          </Button>
        }
      </Card.Header>
      <Card.Content>
        <ul>
          {projectsInfoArray.map((projectInfo, i) => {
            return (
              <li key={i}>
                <ProjectCard
                  createdAt={projectInfo.createdAt}
                  description={projectInfo.description}
                  expiry={projectInfo.expiry}
                  externalId={projectInfo.externalId}
                  id={projectInfo.id}
                  isProjectManager={projectInfo.isProjectManager}
                  name={projectInfo.name}
                  updatedAt={projectInfo.updatedAt}
                  userIds={projectInfo.userIds}
                />
              </li>
            );
          })}
        </ul>
      </Card.Content>
      <Card.Footer className="flex justify-between"></Card.Footer>
    </Card>
  ) : (
    <LoadingFallback />
  );
};

export const ViewProjectsRoute: RouteObject = {
  path: 'projects',
  element: <ViewProjectsPage />
};
