import { DatasetEntry, TDataset } from '@databank/types';
import { Form } from '@douglasneuroinformatics/react-components';
import { useTranslation } from 'react-i18next';

export type DatasetFormData<T extends DatasetEntry = DatasetEntry> = Omit<
  TDataset<T>,
  '_id' | 'createdAt' | 'updatedAt' | 'owner' | 'data'
>;

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
            nullable: {
              kind: 'binary',
              label: t('required'),
              variant: 'radio',
              options: {
                t: t('yes'),
                f: t('no')
              }
            },
            type: {
              kind: 'options',
              label: t('dataType'),
              options: {
                STRING: t('string'),
                INTEGER: t('integer'),
                FLOAT: t('float')
              }
            }
          }
        }
      }}
      errorMessages={t('requiredField')}
      initialValues={{
        name: '',
        description: '',
        license: null,
        columns: [
          {
            name: '',
            description: '',
            nullable: null,
            type: null
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
