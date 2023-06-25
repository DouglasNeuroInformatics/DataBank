import { DatasetColumn } from '@databank/types';
import { Form } from '@douglasneuroinformatics/react-components';

export type DatasetFormData = {
  name: string;
  description: string;
  license: string;
  columns: DatasetColumn[];
};

export interface DatasetFormProps {
  onSubmit: (data: DatasetFormData) => void;
}

export const DatasetForm = ({ onSubmit }: DatasetFormProps) => {
  return (
    <Form<DatasetFormData>
      content={{
        name: {
          kind: 'text',
          label: 'Name',
          variant: 'short'
        },
        description: {
          kind: 'text',
          label: 'Description',
          variant: 'short'
        },
        license: {
          kind: 'options',
          label: 'License',
          options: {
            publicDomain: 'Public Domain'
          }
        },
        columns: {
          kind: 'array',
          label: 'Column',
          fieldset: {
            description: {
              kind: 'text',
              label: 'Description',
              variant: 'long'
            },
            type: {
              kind: 'options',
              label: 'Type',
              options: {
                float: 'Float',
                int: 'Integer',
                str: 'String'
              }
            }
          }
        }
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
