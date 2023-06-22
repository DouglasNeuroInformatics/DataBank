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
        <ul className="divide-y divide-slate-200 rounded-sm shadow dark:divide-slate-700">
          {availableDatasets.map((item) => (
            <li
              className="hover: block bg-slate-50 ring-1 dark:bg-slate-800 ring-black ring-opacity-5 transition-all hover:scale-[101%] hover:shadow-lg"
              key={item._id}
            >
              <Link className="block w-full px-4 py-4 sm:px-6" to={item._id}>
                <p className="font-medium text-sky-700 dark:text-sky-300">{item.name}</p>
                <div className="flex items-center pt-2 text-sm ">
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
