import type { $DatasetCardProps } from '@databank/core';
import { Badge, Button, Card, Separator } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CalendarIcon, DatabaseIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';
import { useDeleteProjectMutation } from '@/hooks/mutations/useDeleteProjectMutation';
import { projectDatasetsQueryOptions, useProjectDatasetsQuery } from '@/hooks/queries/useProjectDatasetsQuery';
import { projectIsManagerQueryOptions, useProjectIsManagerQuery } from '@/hooks/queries/useProjectIsManagerQuery';
import { projectQueryOptions, useProjectQuery } from '@/hooks/queries/useProjectQuery';

const ProjectDatasetCard = ({
  dataset,
  isManager,
  projectId
}: {
  dataset: $DatasetCardProps;
  isManager: boolean;
  projectId: string;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{dataset.name}</p>
        {dataset.description && (
          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{dataset.description}</p>
        )}
        <Badge className="mt-1.5" variant="secondary">
          {dataset.license}
        </Badge>
      </div>
      <Button
        className="ml-4 shrink-0"
        size="sm"
        variant="outline"
        onClick={() =>
          void navigate({
            params: { datasetId: dataset.id, projectId },
            to: '/portal/projects/$projectId/datasets/$datasetId'
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
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const deleteProjectMutation = useDeleteProjectMutation();

  const { data: project } = useProjectQuery(projectId);
  const { data: isManager } = useProjectIsManagerQuery(projectId);
  const { data: datasets } = useProjectDatasetsQuery(projectId);

  const deleteProject = useDestructiveAction(() => {
    deleteProjectMutation.mutate(projectId, {
      onSuccess() {
        void navigate({ to: '/portal/projects' });
      }
    });
  });

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
                    params: { projectId: project.id },
                    search: {
                      description: project.description,
                      expiryDate: project.expiry,
                      externalId: project.externalId,
                      name: project.name
                    },
                    to: '/portal/projects/$projectId/edit'
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
                    params: { projectId: project.id },
                    search: { userIds: project.userIds },
                    to: '/portal/projects/$projectId/users'
                  })
                }
              >
                <UsersIcon className="mr-1.5 size-3.5" />
                {t('manageProjectUsers')}
              </Button>
              <Button size="sm" variant="danger" onClick={() => deleteProject()}>
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
              {datasets.length} {datasets.length === 1 ? 'dataset' : 'datasets'}
            </Card.Description>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void navigate({
                params: { projectId: project.id },
                to: '/portal/projects/$projectId/add-dataset'
              })
            }
          >
            <PlusIcon className="mr-1.5 size-3.5" />
            {t('addDatasetToProject')}
          </Button>
        </Card.Header>
        <Separator />
        <Card.Content className="pt-4">
          {datasets.length === 0 ? (
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
              {datasets.map((dataset) =>
                dataset ? (
                  <ProjectDatasetCard dataset={dataset} isManager={isManager} key={dataset.id} projectId={project.id} />
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
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectQueryOptions(params.projectId)),
      context.queryClient.ensureQueryData(projectIsManagerQueryOptions(params.projectId)),
      context.queryClient.ensureQueryData(projectDatasetsQueryOptions(params.projectId))
    ]);
  }
});
