/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import type { $DatasetCardProps } from '@databank/core';
import { Badge, Button, Card, Separator, Spinner } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { CalendarIcon, DatabaseIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';

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

const ProjectDatasetCard = ({
  datasetId,
  description,
  isManager,
  license,
  name,
  projectId
}: {
  datasetId: string;
  description: null | string;
  isManager: boolean;
  license: string;
  name: string;
  projectId: string;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        {description && <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{description}</p>}
        <Badge className="mt-1.5" variant="secondary">
          {license}
        </Badge>
      </div>
      <Button
        className="ml-4 shrink-0"
        size="sm"
        variant="outline"
        onClick={() =>
          void navigate({
            to: '/portal/projects/$projectId/datasets/$datasetId',
            params: { projectId, datasetId }
          })
        }
      >
        {isManager ? t('manageProjectDataset') : t('viewProjectDataset')}
      </Button>
    </div>
  );
};

const RouteComponent = () => {
  const { projectId } = Route.useParams();
  const [project, setProject] = useState<null | Project>(null);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const [isManager, setIsManager] = useState(false);
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [datasetsInfoArray, setDatasetsInfoArray] = useState<$DatasetCardProps[] | null>(null);

  const deleteProject = useDestructiveAction((id: string) => {
    axios
      .delete(`/v1/projects/${id}`)
      .then(() => {
        addNotification({ type: 'success', message: `Project with Id ${id} has been deleted` });
        void navigate({ to: '/portal/projects' });
      })
      .catch(console.error);
  });

  useEffect(() => {
    axios
      .get<Project>(`/v1/projects/${projectId}`)
      .then((response) => setProject(response.data))
      .catch(console.error);
    axios
      .get<boolean>(`/v1/projects/is-manager/${projectId}`)
      .then((response) => setIsManager(response.data))
      .catch(console.error);
    axios
      .get<$DatasetCardProps[]>(`/v1/projects/datasets/${projectId}`)
      .then((response) => setDatasetsInfoArray(response.data))
      .catch(console.error);
  }, [projectId]);

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeading
        actions={
          isManager ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void navigate({
                    to: '/portal/projects/$projectId/edit',
                    params: { projectId: project.id },
                    search: {
                      name: project.name,
                      description: project.description,
                      externalId: project.externalId,
                      expiryDate: project.expiry
                    }
                  })
                }
              >
                <PencilIcon className="mr-1.5 size-3.5" />
                {t('editProjectInfo')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void navigate({
                    to: '/portal/projects/$projectId/users',
                    params: { projectId: project.id },
                    search: { userIds: project.userIds }
                  })
                }
              >
                <UsersIcon className="mr-1.5 size-3.5" />
                {t('manageProjectUsers')}
              </Button>
              <Button size="sm" variant="danger" onClick={() => deleteProject(projectId)}>
                <TrashIcon className="mr-1.5 size-3.5" />
                {t('deleteProject')}
              </Button>
            </>
          ) : undefined
        }
        description={project.description}
      >
        {project.name}
      </PageHeading>

      <Card className="mb-6">
        <Card.Content className="pt-6">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t('createdAt')}</dt>
              <dd className="mt-1 text-sm">{new Date(project.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t('updatedAt')}</dt>
              <dd className="mt-1 text-sm">{new Date(project.updatedAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {t('projectExternalId')}
              </dt>
              <dd className="mt-1 text-sm">{project.externalId || '-'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {t('projectExpiry')}
              </dt>
              <dd className="mt-1 flex items-center gap-1 text-sm">
                <CalendarIcon className="text-muted-foreground size-3.5" />
                {new Date(project.expiry).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header className="flex-row items-center justify-between space-y-0">
          <div>
            <Card.Title className="text-base">{t('projectDatasets')}</Card.Title>
            <Card.Description>
              {datasetsInfoArray?.length ?? 0} {(datasetsInfoArray?.length ?? 0) === 1 ? 'dataset' : 'datasets'}
            </Card.Description>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void navigate({
                to: '/portal/projects/$projectId/add-dataset',
                params: { projectId: project.id }
              })
            }
          >
            <PlusIcon className="mr-1.5 size-3.5" />
            {t('addDatasetToProject')}
          </Button>
        </Card.Header>
        <Separator />
        <Card.Content className="pt-4">
          {!datasetsInfoArray || datasetsInfoArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <DatabaseIcon className="text-muted-foreground/50 size-10" />
              <p className="text-muted-foreground mt-3 text-sm">
                {t({
                  en: 'No Datasets Added to This Project Yet',
                  fr: 'Aucun base de données ajouté à ce projet pour le moment'
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {datasetsInfoArray.map((datasetInfo) =>
                datasetInfo ? (
                  <ProjectDatasetCard
                    datasetId={datasetInfo.id}
                    description={datasetInfo.description}
                    isManager={isManager}
                    key={datasetInfo.id}
                    license={datasetInfo.license}
                    name={datasetInfo.name}
                    projectId={project.id}
                  />
                ) : null
              )}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/')({
  component: RouteComponent
});
