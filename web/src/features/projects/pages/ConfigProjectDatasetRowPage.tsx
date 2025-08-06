/* eslint-disable perfectionist/sort-objects */
import type { ProjectDatasetConfigStep, ProjectDatasetRowConfig } from '@databank/core';
import { Form } from '@douglasneuroinformatics/libui/components';
import { z } from 'zod';

type ConfigProjectDatasetRowPageProps = {
  setRowConfig: (rowConfig: ProjectDatasetRowConfig) => void;
  setStep: (step: ProjectDatasetConfigStep) => void;
};

export const ConfigProjectDatasetRowPage = ({ setRowConfig, setStep }: ConfigProjectDatasetRowPageProps) => {
  const handleSubmitRowConfig = (data: ProjectDatasetRowConfig) => {
    const rowConfigObject: ProjectDatasetRowConfig = {
      rowMin: 0,
      rowMax: null
    };
    if (data.rowMax) {
      rowConfigObject.rowMax = data.rowMax;
    }
    rowConfigObject.rowMin = data.rowMin;
    setRowConfig(rowConfigObject);
    setStep('configColumns');
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
      onSubmit={(data) => handleSubmitRowConfig({ rowMin: data.rowMin, rowMax: data.rowMax ?? null })}
    />
  );
};
