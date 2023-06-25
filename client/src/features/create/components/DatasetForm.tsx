import { DatasetColumn } from '@databank/types';
import { Form } from '@douglasneuroinformatics/react-components';
import { useTranslation } from 'react-i18next';

import { ParsedCSV } from '@/utils/parse-csv';

export type DatasetFormData = {
  name: string;
  description: string;
  license: string;
  columns: DatasetColumn[];
};

export interface DatasetFormProps {
  //initialValues: ParsedCSV;
  onSubmit: (data: DatasetFormData) => void;
}

export const DatasetForm = ({ onSubmit }: DatasetFormProps) => {
  const { t } = useTranslation();
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
            publicDomain: t('publicDomain'),
            other: t('other')
          }
        },
        columns: {
          kind: 'array',
          label: t('column'),
          fieldset: {
            description: {
              kind: 'text',
              label: t('description'),
              variant: 'long'
            },
            type: {
              kind: 'options',
              label: t('dataType'),
              options: {
                float: 'Float',
                int: 'Integer',
                str: 'String'
              }
            }
          }
        }
      }}
      initialValues={{
        name: '',
        description: '',
        license: '',
        columns: [
          {
            description: '',
            type: 'int'
          }
        ]
      }}
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
                description: {
                  type: 'string',
                  minLength: 1
                },
                type: {
                  type: 'string',
                  enum: ['float', 'int', 'str']
                }
              },
              required: ['description', 'type']
            }
          }
        },
        required: ['name', 'description', 'license']
      }}
      onSubmit={onSubmit}
    />
  );
};
