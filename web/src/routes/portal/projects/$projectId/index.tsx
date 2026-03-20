import { licensesObjects } from '@databank/core';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CalendarIcon, DatabaseIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';
import { useDeleteProjectMutation } from '@/hooks/mutations/useDeleteProjectMutation';
import { projectDatasetsQueryOptions, useProjectDatasetsQuery } from '@/hooks/queries/useProjectDatasetsQuery';
import { projectIsManagerQueryOptions, useProjectIsManagerQuery } from '@/hooks/queries/useProjectIsManagerQuery';
import { projectQueryOptions, useProjectQuery } from '@/hooks/queries/useProjectQuery';

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
                      description: project.description ?? undefined,
                      expiryDate: project.expiry,
                      externalId: project.externalId ?? undefined,
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
              <dd className="mt-1 text-sm">{project.externalId ?? '-'}</dd>
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

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">{t('projectDatasets')}</h2>
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
      </div>
      {datasets.length === 0 ? (
        <Card>
          <Card.Content className="flex flex-col items-center justify-center py-12">
            <DatabaseIcon className="text-muted-foreground/50 size-10" />
            <p className="text-muted-foreground mt-3 text-sm">
              {t({
                en: 'No Datasets Added to This Project Yet',
                fr: 'Aucun base de données ajouté à ce projet pour le moment'
              })}
            </p>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content className="divide-y p-0">
            {datasets.map((dataset) =>
              dataset ? (
                <div className="flex w-full items-center justify-between px-6 py-5" key={dataset.id}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{dataset.name}</p>
                    {dataset.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{dataset.description}</p>
                    )}
                    <div className="text-muted-foreground mt-2 flex flex-col text-sm">
                      <p>
                        <span className="font-semibold tracking-tight">{t({ en: 'License: ' })}</span>
                        {licensesObjects[dataset.license]?.name ?? dataset.license}
                      </p>
                      <p>
                        <span className="font-semibold tracking-tight">
                          {t({ en: 'Updated: ', fr: 'Mis à jour : ' })}
                        </span>
                        {new Date(dataset.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="ml-6 shrink-0"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void navigate({
                        params: { datasetId: dataset.id, projectId: project.id },
                        to: '/portal/projects/$projectId/datasets/$datasetId'
                      })
                    }
                  >
                    {isManager ? t('manageProjectDataset') : t('viewProjectDataset')}
                  </Button>
                </div>
              ) : null
            )}
          </Card.Content>
        </Card>
      )}
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
