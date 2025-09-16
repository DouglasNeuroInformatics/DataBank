import { $Summary } from '@databank/core';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { UserIcon, UsersIcon } from '@heroicons/react/24/solid';
import { Navigate } from '@tanstack/react-router';

import { useAuthStore } from '@/stores/auth-store';

import { StatisticCard } from '../components/StatisticCard';

export const Summary = ({ datasetCounts, projectCounts }: $Summary) => {
  const { t } = useTranslation('common');
  const { currentUser } = useAuthStore();
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="body-font">
      <div className="grid grid-cols-1 gap-5 text-center lg:grid-cols-2">
        <StatisticCard icon={<UsersIcon className="h-12 w-12" />} label={t('totalDatasets')} value={datasetCounts} />
        <StatisticCard icon={<UserIcon className="h-12 w-12" />} label={t('totalProjects')} value={projectCounts} />
      </div>
    </div>
  );
};
