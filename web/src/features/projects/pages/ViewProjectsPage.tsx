/* eslint-disable perfectionist/sort-objects */
import { $ProjectInfo } from '@databank/core';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

import { PageHeading } from '@/components/PageHeading';
import { useAuthStore } from '@/stores/auth-store';

import { ProjectCard } from '../components/ProjectCard';

type ViewProjectsPageProps = {
  projectsInfoArray: $ProjectInfo[];
};

const ViewProjectsPage = ({ projectsInfoArray }: ViewProjectsPageProps) => {
  const { currentUser } = useAuthStore();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);

  const handleCreateProject = () => {
    if (currentUser?.datasetIds.length && currentUser?.datasetIds.length > 0) {
      void navigate({ to: '/portal/projects/create' });
    } else {
      addNotification({
        type: 'error',
        message: 'Please upload your own dataset before creating a project!'
      });
    }
  };

  return (
    <>
      <PageHeading>{t('projects')}</PageHeading>
      <Card>
        <Card.Header>
          <Button className="m-2" variant={'secondary'} onClick={handleCreateProject}>
            Create New Project
          </Button>
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
    </>
  );
};

export { ViewProjectsPage };
