import { useEffect } from 'react';

import { Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, Link } from '@tanstack/react-router';
import { DatabaseIcon, FolderOpenIcon, PlusIcon } from 'lucide-react';
import { motion, useSpring, useTransform } from 'motion/react';

import { PageHeading } from '@/components/PageHeading';
import { dashboardSummaryQueryOptions, useDashboardSummaryQuery } from '@/hooks/queries/useDashboardSummaryQuery';

const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(0, { bounce: 0 });
  const rounded = useTransform(spring, (latest: number) => Math.floor(latest));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{rounded}</motion.span>;
};

const StatCard = ({
  createHref,
  createLabel,
  icon: Icon,
  label,
  value
}: {
  createHref: string;
  createLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) => {
  return (
    <Card>
      <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <Icon className="text-muted-foreground size-5" />
      </Card.Header>
      <Card.Content>
        <div className="text-3xl font-bold tabular-nums">
          <AnimatedNumber value={value} />
        </div>
      </Card.Content>
      <Card.Footer>
        <Link
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium"
          to={createHref}
        >
          <PlusIcon className="size-3.5" />
          {createLabel}
        </Link>
      </Card.Footer>
    </Card>
  );
};

const RouteComponent = () => {
  const { t } = useTranslation('common');
  const { data } = useDashboardSummaryQuery();

  return (
    <div>
      <PageHeading>{t('dashboard')}</PageHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          createHref="/portal/datasets/create"
          createLabel={t('createDataset')}
          icon={DatabaseIcon}
          label={t('totalDatasets')}
          value={data.datasetCounts}
        />
        <StatCard
          createHref="/portal/projects/create"
          createLabel={t({
            en: 'Create New Project',
            fr: 'Créer un nouveau projet'
          })}
          icon={FolderOpenIcon}
          label={t('totalProjects')}
          value={data.projectCounts}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/portal/dashboard')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(dashboardSummaryQueryOptions());
  }
});
