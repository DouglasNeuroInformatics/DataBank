import { useCallback } from 'react';

import type { Activity } from '@databank/types';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

export type ActivityCardProps = {
  /** The activity the user performed */
  activity: Activity;

  /** The full name of the user who performed the activity */
  fullName: string;

  /** The exact timestamp of when the activity was performed */
  timestamp: number;
};

export const ActivityCard = ({ activity, fullName, timestamp }: ActivityCardProps) => {
  const { i18n, t } = useTranslation();

  /** Return a string representing the time passed since the timestamp */
  const formatTimestamp = useCallback(
    (timestamp: number) => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      let interval = seconds / 31536000;

      if (interval > 1) {
        return Math.floor(interval) + t('timeUnit.year');
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + t('timeUnit.month');
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + t('timeUnit.day');
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + t('timeUnit.hour');
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + t('timeUnit.minute');
      }
      return Math.floor(seconds) + t('timeUnit.second');
    },
    [i18n.resolvedLanguage]
  );

  return (
    <div className="flex items-center justify-between space-x-3">
      <img alt="user" className="h-6 w-6 rounded-full" src="https://placehold.co/400" />
      <div className="flex flex-1 flex-col justify-between space-y-1 sm:flex-row">
        <div className="flex-grow space-y-1">
          <h3 className="text-sm font-medium">{fullName}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {match(activity)
              .with({ kind: 'CREATED_DATASET' }, ({ datasetName }) =>
                t('activity.createdDataset', { name: datasetName })
              )
              .with({ kind: 'UPDATED_DATASET' }, ({ datasetName }) =>
                t('activity.updatedDataset', { name: datasetName })
              )
              .exhaustive()}
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">{formatTimestamp(timestamp)}</p>
        </div>
      </div>
    </div>
  );
};
