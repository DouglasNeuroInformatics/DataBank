import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';

import { PageHeading } from '@/components/PageHeading';
import { publicDatasetsQueryOptions, usePublicDatasetsQuery } from '@/hooks/queries/usePublicDatasetsQuery';

const RouteComponent = () => {
  const { t } = useTranslation('common');

  const { data: datasets } = usePublicDatasetsQuery();

  return (
    <>
      <PageHeading>{t('datasets')}</PageHeading>
      <ul className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {datasets.map((dataset, i) => {
            return (
              <motion.li
                layout
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
                initial={{ opacity: 0, y: 80 }}
                key={dataset.id}
                transition={{ bounce: 0.2, delay: 0.15 * i, duration: 1.5, type: 'spring' }}
              >
                <Card key={dataset.id}>
                  <Card.Header>
                    <Card.Title>{dataset.name}</Card.Title>
                    <Card.Description>{dataset.description}</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <Button asChild className="w-fit">
                      <Link params={{ datasetId: dataset.id }} to="/datasets/$datasetId">
                        {t('viewDataset')}
                      </Link>
                    </Button>
                  </Card.Content>
                </Card>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </>
  );
};

export const Route = createFileRoute('/_public/datasets/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(publicDatasetsQueryOptions());
  }
});
