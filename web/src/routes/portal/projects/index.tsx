import { $ProjectInfo } from '@databank/core';
import { Badge, Button, Card } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CalendarIcon, FolderOpenIcon, PlusIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';
import { useProjectIsManagerQuery } from '@/hooks/queries/useProjectIsManagerQuery';
import { projectsQueryOptions, useProjectsQuery } from '@/hooks/queries/useProjectsQuery';
import { useAppStore } from '@/store';

const ProjectCard = ({ project }: { project: $ProjectInfo }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { data: isProjectManager } = useProjectIsManagerQuery(project.id);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <Card.Header className="pb-3">
        <Card.Title className="truncate">{project.name}</Card.Title>
        {project.description && <Card.Description className="line-clamp-2">{project.description}</Card.Description>}
      </Card.Header>
      <Card.Content className="pb-3">
        <dl className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="font-medium">{t('projectExternalId')}</dt>
          <dd className="truncate">{project.externalId ?? '-'}</dd>
          <dt className="font-medium">{t('projectExpiry')}</dt>
          <dd className="flex items-center gap-1">
            <CalendarIcon className="size-3" />
            {new Date(project.expiry).toLocaleDateString()}
          </dd>
        </dl>
        {project.userIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="secondary">
              {project.userIds.length} {project.userIds.length === 1 ? 'user' : 'users'}
            </Badge>
          </div>
        )}
      </Card.Content>
      <Card.Footer>
        <Button size="sm" variant="outline" onClick={() => void navigate({ to: `/portal/projects/${project.id}` })}>
          {isProjectManager ? t('manageProject') : t('viewProject')}
        </Button>
      </Card.Footer>
    </Card>
  );
};

const RouteComponent = () => {
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { data: projects } = useProjectsQuery();

  const handleCreateProject = () => {
    if (currentUser?.datasetIds.length && currentUser.datasetIds.length > 0) {
      void navigate({ to: '/portal/projects/create' });
    } else {
      addNotification({
        message: t({
          en: 'Please upload your own dataset before creating a project!',
          fr: 'Veuillez télécharger votre propre base de données avant de créer un projet!'
        }),
        type: 'error'
      });
    }
  };

  return (
    <div>
      <PageHeading
        actions={
          <Button size="sm" onClick={handleCreateProject}>
            <PlusIcon className="mr-1.5 size-4" />
            {t({
              en: 'Create New Project',
              fr: 'Créer un nouveau projet'
            })}
          </Button>
        }
      >
        {t('projects')}
      </PageHeading>
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FolderOpenIcon className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4 text-lg font-medium">
            {t({
              en: 'No Projects Yet',
              fr: 'Aucun projet pour le moment'
            })}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {t({
              en: 'Create your first project to get started.',
              fr: 'Créez votre premier projet pour commencer.'
            })}
          </p>
          <Button className="mt-6" variant="outline" onClick={handleCreateProject}>
            <PlusIcon className="mr-1.5 size-4" />
            {t({
              en: 'Create New Project',
              fr: 'Créer un nouveau projet'
            })}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(projectsQueryOptions());
  }
});
