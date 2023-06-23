import { Form, Modal } from '@douglasneuroinformatics/react-components';

export type CreateDatasetData = {
  name: string;
  description?: string;
};

export interface CreateDatasetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDatasetData) => void;
}

export const CreateDatasetModal = ({ open, onClose, onSubmit }: CreateDatasetModalProps) => {
  return (
    <Modal open={open} title="Create Dataset" onClose={onClose}>
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
              nullable: true
            }
          },
          required: ['name']
        }}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};
