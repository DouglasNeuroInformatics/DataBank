import { licensesObjects } from '@databank/core';
import type { $DatasetInfo } from '@databank/core';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DatabaseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { EmptyState } from '@/components/EmptyState';
import { PageContainer } from '@/components/PageContainer';
import { PageHeading } from '@/components/PageHeading';
import { publicDatasetsQueryOptions, usePublicDatasetsQuery } from '@/hooks/queries/usePublicDatasetsQuery';

const DatasetCard: React.FC<{ dataset: $DatasetInfo; index: number }> = ({ dataset, index }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const licenseInfo = licensesObjects[dataset.license];

  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      initial={{ opacity: 0, y: 80 }}
      transition={{ bounce: 0.2, delay: 0.1 * index, duration: 1.5, type: 'spring' }}
    >
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
        <Card.Header className="pb-3">
          <Card.Title className="truncate">{dataset.name}</Card.Title>
          <Card.Description className="line-clamp-2 min-h-10">{dataset.description}</Card.Description>
        </Card.Header>
        <Card.Content className="pb-3">
          <dl className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="font-medium">{t({ en: 'License', fr: 'Licence' })}</dt>
            <dd className="truncate" title={licenseInfo?.name}>
              {dataset.license}
            </dd>
            <dt className="font-medium">{t({ en: 'Created', fr: 'Créé' })}</dt>
            <dd>{new Date(dataset.createdAt).toLocaleDateString()}</dd>
          </dl>
        </Card.Content>
        <Card.Footer className="mt-auto pt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => void navigate({ params: { datasetId: dataset.id }, to: '/datasets/$datasetId' })}
          >
            {t({ en: 'View Dataset', fr: 'Voir le jeu de données' })}
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

const RouteComponent = () => {
  const { t } = useTranslation();
  const { data: datasets } = usePublicDatasetsQuery();

  return (
    <PageContainer>
      <PageHeading>{t({ en: 'Public Datasets', fr: 'Jeux de données publics' })}</PageHeading>
      {datasets.length === 0 ? (
        <EmptyState
          description={t({
            en: 'There are no publicly shared datasets at this time.',
            fr: "Il n'y a aucun jeu de données partagé publiquement pour le moment."
          })}
          icon={DatabaseIcon}
          title={t({ en: 'No Public Datasets Available', fr: 'Aucun jeu de données public disponible' })}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {datasets.map((dataset, i) => (
              <DatasetCard dataset={dataset} index={i} key={dataset.id} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </PageContainer>
  );
};

export const Route = createFileRoute('/_public/datasets/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(publicDatasetsQueryOptions());
  }
});
