import { useEffect, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import { CalendarIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { SuspenseFallback } from '@/components';
import { Heading } from '@/components/Heading';

export const SharedPage = () => {
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>();
  const { t, i18n } = useTranslation();

  const fetchAvailable = async () => {
    const response = await axios.get<DatasetInfo[]>('/v1/datasets/available');
    setAvailableDatasets(response.data);
  };

  useEffect(() => {
    void fetchAvailable();
  }, []);

  return (
    <div>
      <Heading title="Shared Datasets" />
      {availableDatasets ? (
        <ul className="divide-y divide-slate-300 rounded-sm shadow">
          {availableDatasets.map((item) => (
            <li className="block hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150" key={item._id}>
              <Link className="block w-full px-4 py-4 sm:px-6" to={item._id}>
                <p className="font-medium text-sky-700 dark:text-sky-300">{item.name}</p>
                <div className="flex items-center pt-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>
                    {`${t('lastUpdated')} ${new Date(item.updatedAt).toLocaleDateString(i18n.resolvedLanguage, {
                      dateStyle: 'long'
                    })}`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <SuspenseFallback />
      )}
    </div>
  );
};
