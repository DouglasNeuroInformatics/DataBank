import { Form } from '@douglasneuroinformatics/react-components';

export type CreateDatasetData = {
  name: string;
  description: string;
};

export interface CreateDatasetFormProps {
  onSubmit: (data: CreateDatasetData) => void;
}

export const CreateDatasetForm = ({ onSubmit }: CreateDatasetFormProps) => {
  return (
    <Form<CreateDatasetData>
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
            minLength: 1,
          }
        },
        required: ['name', 'description']
      }}
      onSubmit={onSubmit}
    />
  );
};
