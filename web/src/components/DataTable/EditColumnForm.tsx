import type { DatasetColumnType } from '@databank/types';
import type { NullableFormInstrumentData } from '@douglasneuroinformatics/form-types';
import { Form } from '@douglasneuroinformatics/ui'
import { useTranslation } from 'react-i18next';

export type EditColumnFormData = {
  type: DatasetColumnType;
};

export type EditColumnFormProps = {
  initialValues?: NullableFormInstrumentData<EditColumnFormData> | null;
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
            FLOAT: t('float'),
            INTEGER: t('integer'),
            STRING: t('string')
          }
        }
      }}
      initialValues={initialValues}
      validationSchema={{
        properties: {
          type: {
            enum: ['FLOAT', 'INTEGER', 'STRING'],
            type: 'string'
          }
        },
        required: ['type'],
        type: 'object'
      }}
      onSubmit={onSubmit}
    />
  );
};
