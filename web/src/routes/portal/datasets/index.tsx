import { createFileRoute } from '@tanstack/react-router';

import { ViewDatasetsPage } from '@/features/dataset/pages/ViewDatasetsPage';

export const Route = createFileRoute('/portal/datasets/')({
  component: () => <ViewDatasetsPage isPublic={false} />
});
