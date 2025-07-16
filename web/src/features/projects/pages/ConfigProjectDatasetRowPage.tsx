/* eslint-disable perfectionist/sort-objects */
import type { ProjectDatasetRowConfig } from '@databank/core';
import { Form } from '@douglasneuroinformatics/libui/components';
import { z } from 'zod';

type ConfigProjectDatasetRowPageProps = {
  setRowConfig: (rowConfig: ProjectDatasetRowConfig) => void;
};

export const ConfigProjectDatasetRowPage = ({ setRowConfig }: ConfigProjectDatasetRowPageProps) => {
  const handleSubmitRowConfig = (data: { [key: string]: any }) => {
    const rowConfigObject: ProjectDatasetRowConfig = {
      rowMin: 0
    };
    if (data.rowMax) {
      rowConfigObject.rowMax = data.rowMax as number;
    }
    rowConfigObject.rowMin = data.rowMin as number;
    setRowConfig(rowConfigObject);
  };

  return (
    <Form
      content={{
        rowMin: {
          kind: 'number',
          label: 'Row filter minimum',
          variant: 'input'
        },
        rowMax: {
          kind: 'number',
          label: 'Row filter maximum',
          variant: 'input'
        }
      }}
      validationSchema={z.object({
        rowMin: z.number().int().gte(0),
        rowMax: z.number().int().gte(0).optional()
      })}
      onSubmit={(data) => handleSubmitRowConfig(data)}
    />
  );
};
