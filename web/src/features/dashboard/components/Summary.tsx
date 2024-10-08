import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { UserIcon, UsersIcon } from '@heroicons/react/24/solid';
import { Navigate } from 'react-router-dom';

import { LoadingFallback } from '@/components/LoadingFallback';
import { useAuthStore } from '@/stores/auth-store';

import { StatisticCard } from '../components/StatisticCard';
import { useSummaryQuery } from '../hooks/useSummaryQuery';

export const Summary = () => {
  const { t } = useTranslation('common');
  const { currentUser } = useAuthStore();
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  const summaryQuery = useSummaryQuery();

  if (!summaryQuery.data) {
    return <LoadingFallback />;
  }

  return (
    <div className="body-font">
      <div className="grid grid-cols-1 gap-5 text-center lg:grid-cols-2">
        <StatisticCard
          icon={<UsersIcon className="h-12 w-12" />}
          label={t('totalDatasets')}
          value={summaryQuery.data.datasetCounts}
        />
        <StatisticCard
          icon={<UserIcon className="h-12 w-12" />}
          label={t('totalProjects')}
          value={summaryQuery.data.projectCounts}
        />
      </div>
    </div>
  );
};
