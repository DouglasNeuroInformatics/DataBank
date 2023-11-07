import type { DatasetColumnType } from '@databank/types';
import type { NullableFormDataType } from '@douglasneuroinformatics/form-types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export type EditColumnFormData = {
  type: DatasetColumnType;
};

export type EditColumnFormProps = {
  initialValues?: NullableFormDataType<EditColumnFormData> | null;
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
      validationSchema={z.object({
        type: z.enum(['FLOAT', 'INTEGER', 'STRING'])
      })}
      onSubmit={onSubmit}
    />
  );
};
