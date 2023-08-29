import { useMemo } from 'react';

import { DatasetEntry, TDataset } from '@databank/types';
import { Form, FormValues } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';

import { InferredColumn } from './DatasetDropzone';

export type DatasetFormData<T extends DatasetEntry = DatasetEntry> = Omit<
  TDataset<T>,
  '_id' | 'createdAt' | 'updatedAt' | 'owner' | 'data'
>;

export type DatasetFormProps = {
  inferredColumns: InferredColumn[];
  onSubmit: (data: DatasetFormData) => void;
};

export const DatasetForm = ({ inferredColumns, onSubmit }: DatasetFormProps) => {
  const { t } = useTranslation();

  const initialValues: FormValues<DatasetFormData> = useMemo(() => {
    return {
      name: '',
      description: '',
      license: null,
      columns: inferredColumns.map((col) => ({
        name: col.name,
        description: null,
        nullable: null,
        type: col.type
      }))
    };
  }, []);

  return (
    <Form<DatasetFormData>
      content={{
        name: {
          kind: 'text',
          label: t('name'),
          variant: 'short'
        },
        description: {
          kind: 'text',
          label: t('description'),
          variant: 'long'
        },
        license: {
          kind: 'options',
          label: t('license'),
          options: {
            PUBLIC_DOMAIN: t('publicDomain'),
            OTHER: t('other')
          }
        },
        columns: {
          kind: 'array',
          label: t('column'),
          fieldset: {
            name: {
              kind: 'text',
              label: t('name'),
              variant: 'short'
            },
            description: {
              kind: 'text',
              label: t('description'),
              variant: 'long'
            },
            type: {
              kind: 'options',
              label: t('dataType'),
              options: {
                STRING: t('string'),
                INTEGER: t('integer'),
                FLOAT: t('float')
              }
            },
            nullable: {
              kind: 'binary',
              label: t('nullable'),
              variant: 'radio',
              options: {
                t: t('yes'),
                f: t('no')
              }
            }
          }
        }
      }}
      errorMessages={t('requiredField')}
      initialValues={initialValues}
      validationSchema={{
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1
          },
          description: {
            type: 'string',
            minLength: 1
          },
          license: {
            type: 'string',
            minLength: 1
          },
          columns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  minLength: 1
                },
                description: {
                  type: 'string',
                  minLength: 1
                },
                nullable: {
                  type: 'boolean'
                },
                type: {
                  type: 'string',
                  enum: ['FLOAT', 'INTEGER', 'STRING']
                }
              },
              required: ['description', 'name', 'nullable', 'type']
            }
          }
        },
        required: ['name', 'description', 'license', 'columns']
      }}
      onSubmit={onSubmit}
    />
  );
};
