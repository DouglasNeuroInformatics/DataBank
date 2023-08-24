import { DatasetColumnType } from '@databank/types';
import { Form, FormValues } from '@douglasneuroinformatics/react-components';
import { useTranslation } from 'react-i18next';

export type EditColumnFormData = {
  type: DatasetColumnType;
};

export type EditColumnFormProps = {
  initialValues?: FormValues<EditColumnFormData> | null;
  onSubmit: (data: EditColumnFormData) => void;
};

export const EditColumnForm = ({ initialValues, onSubmit }: EditColumnFormProps) => {
  const { t } = useTranslation();
  return (
    <Form<EditColumnFormData>
      content={{
        type: {
          kind: 'options',
          label: t('dataType'),
          options: {
            STRING: t('string'),
            INTEGER: t('integer'),
            FLOAT: t('float')
          }
        }
      }}
      initialValues={initialValues}
      validationSchema={{
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['FLOAT', 'INTEGER', 'STRING']
          }
        },
        required: ['type']
      }}
      onSubmit={onSubmit}
    />
  );
};
