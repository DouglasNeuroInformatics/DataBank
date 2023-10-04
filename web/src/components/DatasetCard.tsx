import type { DatasetInfo } from '@databank/types';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

export type DatasetCardProps = {
  className?: string;
  dataset: DatasetInfo;
  onClick: (dataset: DatasetInfo) => void;
};

export const DatasetCard = ({ className, dataset, onClick }: DatasetCardProps) => {
  const { i18n, t } = useTranslation();
  return (
    <div
      className={twMerge(
        '@container border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700',
        className
      )}
    >
      <button
        className="w-full px-4 py-4 text-left sm:px-6"
        type="button"
        onClick={() => {
          onClick(dataset);
        }}
      >
        <p className="font-medium text-sky-700 dark:text-sky-300">{dataset.name}</p>
        <div className="@xs:flex hidden items-center pt-2 text-sm">
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
