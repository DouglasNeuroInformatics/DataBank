import { DatasetInfo } from '@databank/types';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

export interface DatasetCardProps {
  dataset: DatasetInfo;
  onClick: (dataset: DatasetInfo) => void;
}

export const DatasetCard = ({ dataset, onClick }: DatasetCardProps) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="bg-slate-50 ring-1 ring-black ring-opacity-5 transition-all hover:scale-[101%] hover:shadow-lg dark:bg-slate-800">
      <button className="w-full px-4 py-4 text-left sm:px-6" type="button" onClick={() => onClick(dataset)}>
        <p className="font-medium text-sky-700 dark:text-sky-300">{dataset.name}</p>
        <div className="flex items-center pt-2 text-sm ">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>
            {`${t('lastUpdated')} ${new Date(dataset.updatedAt).toLocaleDateString(i18n.resolvedLanguage, {
              dateStyle: 'long'
            })}`}
          </span>
        </div>
      </button>
    </div>
  );
};
