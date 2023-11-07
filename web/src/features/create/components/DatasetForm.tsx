import { useMemo } from 'react';

import type { DatasetEntry, TDataset } from '@databank/types';
import type { NullableFormDataType } from '@douglasneuroinformatics/form-types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { type InferredColumn } from './DatasetDropzone';

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

  const initialValues: NullableFormDataType<DatasetFormData> = useMemo(() => {
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
      initialValues={initialValues}
      validationSchema={z.object({
        columns: z.array(
          z.object({
            description: z.string().min(1),
            name: z.string().min(1),
            nullable: z.boolean(),
            type: z.enum(['FLOAT', 'INTEGER', 'STRING'])
          })
        ),
        description: z.string().min(1),
        license: z.enum(['PUBLIC_DOMAIN', 'OTHER']),
        name: z.string().min(1)
      })}
      onSubmit={onSubmit}
    />
  );
};
