import { Button } from '@douglasneuroinformatics/react-components';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { DatasetFormData } from './DatasetForm';

const DatasetStructureItem = (props: { label: string; value: string }) => {
  const { i18n } = useTranslation();
  const separator = i18n.resolvedLanguage === 'fr' ? ' : ' : ': ';
  return (
    <div>
      <span>{props.label + separator + props.value}</span>
    </div>
  );
};

export interface ConfirmDatasetStructureProps {
  dataset: DatasetFormData;
}

export const ConfirmDatasetStructure = ({ dataset }: ConfirmDatasetStructureProps) => {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full items-start justify-start space-y-5">
      <h2 className="text-lg font-medium">Dataset Structure</h2>
      <div>
        <h3 className="mb-3 text-lg">Metadata</h3>
        <DatasetStructureItem label={t('datasetName')} value={dataset.name} />
        <DatasetStructureItem label={t('datasetDescription')} value={dataset.description} />
        <DatasetStructureItem
          label={t('datasetLicense')}
          value={match(dataset.license)
            .with('PUBLIC_DOMAIN', () => t('publicDomain'))
            .with('OTHER', () => t('other'))
            .exhaustive()}
        />
      </div>
      <div>
        <h3 className="mb-3 flex flex-col text-lg">Columns</h3>
        {dataset.columns.map((column) => (
          <div className="my-3 flex flex-col" key={column.name}>
            <h4 className="italic">{column.name}</h4>
            <DatasetStructureItem label="Field Description" value={column.description} />
            <DatasetStructureItem label={t('nullable')} value={column.nullable ? t('yes') : t('no')} />
          </div>
        ))}
      </div>
      <Button label={t('submit')} />
    </div>
  );
};
