import { FolderPlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

import { ActivityCard } from '../components/ActivityCard';

import { Heading } from '@/components/Heading';

const ONE_DAY = 86400000;
export const DashboardPage = () => {
  const { i18n } = useTranslation();
  return (
    <div>
      <Heading title="Dashboard" />
      <div>
        <h3 className="text-lg font-medium mb-5">Recent Activity</h3>
        <div className="flex flex-col gap-5">
          <ActivityCard icon={FolderPlusIcon} text="Jane Doe created a new dataset" timestamp={Date.now()} />
          <ActivityCard icon={FolderPlusIcon} text="Jane Doe created a new dataset" timestamp={Date.now() - ONE_DAY} />
          <ActivityCard
            icon={FolderPlusIcon}
            text="Jane Doe created a new dataset"
            timestamp={Date.now() - ONE_DAY * 2}
          />
          <ActivityCard
            icon={FolderPlusIcon}
            text="Jane Doe created a new dataset"
            timestamp={Date.now() - ONE_DAY * 3}
          />
        </div>
      </div>
    </div>
  );
};
