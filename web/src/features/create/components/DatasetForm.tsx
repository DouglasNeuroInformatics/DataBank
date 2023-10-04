import { useMemo } from 'react';

import { DatasetEntry, TDataset } from '@databank/types';
import { NullableFormInstrumentData } from '@douglasneuroinformatics/form-types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';

import { InferredColumn } from './DatasetDropzone';

export type DatasetFormData<T extends DatasetEntry = DatasetEntry> = Omit<
  TDataset<T>,
  '_id' | 'createdAt' | 'data' | 'owner' | 'updatedAt'
>;

export type DatasetFormProps = {
  inferredColumns: InferredColumn[];
  onSubmit: (data: DatasetFormData) => void;
};

export const DatasetForm = ({ inferredColumns, onSubmit }: DatasetFormProps) => {
  const { t } = useTranslation();

  const initialValues: NullableFormInstrumentData<DatasetFormData> = useMemo(() => {
    return {
      columns: inferredColumns.map((col) => ({
        description: null,
        name: col.name,
        nullable: null,
        type: col.type
      })),
      description: '',
      license: null,
      name: ''
    };
  }, []);

  return (
    <Form<DatasetFormData>
      content={{
        columns: {
          fieldset: {
            description: {
              kind: 'text',
              label: t('description'),
              variant: 'long'
            },
            name: {
              kind: 'text',
              label: t('name'),
              variant: 'short'
            },
            nullable: {
              kind: 'binary',
              label: t('nullable'),
              options: {
                f: t('no'),
                t: t('yes')
              },
              variant: 'radio'
            },
            type: {
              kind: 'options',
              label: t('dataType'),
              options: {
                FLOAT: t('float'),
                INTEGER: t('integer'),
                STRING: t('string')
              }
            }
          },
          kind: 'array',
          label: t('column')
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
            OTHER: t('other'),
            PUBLIC_DOMAIN: t('publicDomain')
          }
        },
        name: {
          kind: 'text',
          label: t('name'),
          variant: 'short'
        }
      }}
      errorMessages={t('requiredField')}
      initialValues={initialValues}
      validationSchema={{
        properties: {
          columns: {
            items: {
              properties: {
                description: {
                  minLength: 1,
                  type: 'string'
                },
                name: {
                  minLength: 1,
                  type: 'string'
                },
                nullable: {
                  type: 'boolean'
                },
                type: {
                  enum: ['FLOAT', 'INTEGER', 'STRING'],
                  type: 'string'
                }
              },
              required: ['description', 'name', 'nullable', 'type'],
              type: 'object'
            },
            type: 'array'
          },
          description: {
            minLength: 1,
            type: 'string'
          },
          license: {
            minLength: 1,
            type: 'string'
          },
          name: {
            minLength: 1,
            type: 'string'
          }
        },
        required: ['name', 'description', 'license', 'columns'],
        type: 'object'
      }}
      onSubmit={onSubmit}
    />
  );
};
