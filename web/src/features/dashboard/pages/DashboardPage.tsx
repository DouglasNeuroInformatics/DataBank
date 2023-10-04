import { useTranslation } from 'react-i18next';

import { Heading } from '@/components/Heading';

import { ActivityCard } from '../components/ActivityCard';

const ONE_DAY = 86400000;

const items = [
  {
    activity: {
      datasetName: 'Iris',
      kind: 'UPDATED_DATASET'
    },
    fullName: 'Jane Doe',
    timestamp: Date.now()
  },
  {
    activity: {
      datasetName: 'Iris',
      kind: 'UPDATED_DATASET'
    },
    fullName: 'Jane Doe',
    timestamp: Date.now() - ONE_DAY
  },
  {
    activity: {
      datasetName: 'Iris',
      kind: 'UPDATED_DATASET'
    },
    fullName: 'Jane Doe',
    timestamp: Date.now() - ONE_DAY * 2
  },
  {
    activity: {
      datasetName: 'Iris',
      kind: 'CREATED_DATASET'
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
