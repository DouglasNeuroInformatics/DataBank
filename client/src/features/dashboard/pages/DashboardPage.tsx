import { useTranslation } from 'react-i18next';

import { ActivityCard } from '../components/ActivityCard';

import { Heading } from '@/components/Heading';

const ONE_DAY = 86400000;

const items = [
  {
    activity: {
      kind: 'UPDATED_DATASET',
      datasetName: 'Iris'
    },
    fullName: 'Jane Doe',
    timestamp: Date.now()
  },
  {
    activity: {
      kind: 'UPDATED_DATASET',
      datasetName: 'Iris'
    },
    fullName: 'Jane Doe',
    timestamp: Date.now() - ONE_DAY
  },
  {
    activity: {
      kind: 'UPDATED_DATASET',
      datasetName: 'Iris'
    },
    fullName: 'Jane Doe',
    timestamp: Date.now() - ONE_DAY * 2
  },
  {
    activity: {
      kind: 'CREATED_DATASET',
      datasetName: 'Iris'
    },
    fullName: 'Jane Doe',
    timestamp: Date.now() - ONE_DAY * 3
  }
] as const;

export const DashboardPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Heading title={t('dashboard')} />
      <div>
        <h3 className="mb-1 text-lg font-medium">{t('recentActivity')}</h3>
        <ul className="divide-y divide-slate-300 dark:divide-slate-600">
          {items.map((item) => (
            <li className="py-4" key={item.timestamp}>
              <ActivityCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
