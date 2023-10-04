import { Button, useNotificationsStore } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';
import { ZodError } from 'zod';

import { useValidationSchema } from '@/hooks/useValidationSchema';

import { type DatasetFormData } from './DatasetForm';

const DatasetStructureItem = (props: { label: string; value: string }) => {
  const { i18n } = useTranslation();
  const separator = i18n.resolvedLanguage === 'fr' ? ' : ' : ': ';
  return (
    <div>
      <span>{props.label + separator + props.value}</span>
    </div>
  );
};

export type CreateDatasetData = DatasetFormData & {
  data: Record<string, number | string>[];
};

export type ConfirmDatasetStructureProps = {
  dataset: CreateDatasetData;
  onSubmit: (data: CreateDatasetData) => void;
};

export const ConfirmDatasetStructure = ({ dataset, onSubmit }: ConfirmDatasetStructureProps) => {
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  const validationSchema = useValidationSchema(dataset);

  const handleSubmit = (dataset: CreateDatasetData) => {
    try {
      validationSchema.parse(dataset.data);
      onSubmit(dataset);
    } catch (error) {
      notifications.addNotification({ message: t('schemaValidationFailed'), type: 'error' });
      if (error instanceof ZodError) {
        console.error(error.format());
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-grow flex-col items-start justify-start space-y-5">
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
            <DatasetStructureItem label={t('description')} value={column.description} />
            <DatasetStructureItem label={t('nullable')} value={column.nullable ? t('yes') : t('no')} />
          </div>
        ))}
      </div>
      <Button
        label={t('submit')}
        type="button"
        onClick={() => {
          handleSubmit(dataset);
        }}
      />
    </div>
  );
};
