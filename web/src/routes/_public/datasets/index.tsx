import { licensesObjects } from '@databank/core';
import type { $DatasetInfo } from '@databank/core';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DatabaseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

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
      <Card className="transition-shadow hover:shadow-md">
        <Card.Header className="pb-3">
          <div className="min-w-0">
            <Card.Title className="truncate">{dataset.name}</Card.Title>
            {dataset.description && (
              <Card.Description className="mt-1 line-clamp-2">{dataset.description}</Card.Description>
            )}
          </div>
        </Card.Header>
        <Card.Content>
          <dl className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="font-medium">{t({ en: 'License', fr: 'Licence' })}</dt>
            <dd className="truncate" title={licenseInfo?.name}>
              {dataset.license}
            </dd>
            <dt className="font-medium">{t({ en: 'Created', fr: 'Créé' })}</dt>
            <dd>{new Date(dataset.createdAt).toLocaleDateString()}</dd>
          </dl>
        </Card.Content>
        <Card.Footer>
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
    <div>
      <PageHeading>{t({ en: 'Public Datasets', fr: 'Jeux de données publics' })}</PageHeading>
      {datasets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <DatabaseIcon className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4 text-lg font-medium">
            {t({ en: 'No Public Datasets Available', fr: 'Aucun jeu de données public disponible' })}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {t({
              en: 'There are no publicly shared datasets at this time.',
              fr: "Il n'y a aucun jeu de données partagé publiquement pour le moment."
            })}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {datasets.map((dataset, i) => (
              <DatasetCard dataset={dataset} index={i} key={dataset.id} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/_public/datasets/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(publicDatasetsQueryOptions());
  }
});
