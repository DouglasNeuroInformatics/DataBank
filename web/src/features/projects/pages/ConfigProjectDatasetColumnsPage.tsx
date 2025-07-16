import type { ProjectDatasetColumnConfig } from '@databank/core';
import { Form } from '@douglasneuroinformatics/libui/components';
import { z } from 'zod';

import type { SelectedColumnsRecord } from '../store/useProjectDatasetConfigStoreFactory';

type ConfigProjectDatasetColumnsPageProps = {
  pageSize: number;
  projectId: string;
  selectedColumns: SelectedColumnsRecord;
  setColumnsConfig: (colId: string, colConfig: ProjectDatasetColumnConfig) => void;
  setPageSize: (newPageSize: number) => void;
};

export const ConfigProjectDatasetColumnsPage = ({
  selectedColumns,
  setColumnsConfig
}: ConfigProjectDatasetColumnsPageProps) => {
  const generateValidationSchema = (selectedColumns: SelectedColumnsRecord) => {
    const formValidationObject: { [key: string]: any } = {};

    for (const columnId in selectedColumns) {
      formValidationObject[columnId] = z.boolean().default(false);
      formValidationObject[columnId + 'HashLength'] = z.number().int().gte(0).optional();
      formValidationObject[columnId + 'HashSalt'] = z.string().optional();
      formValidationObject[columnId + 'TrimStart'] = z.number().int().gte(0).optional();
      formValidationObject[columnId + 'TrimEnd'] = z.number().int().gte(0).optional();
    }
    return z.object(formValidationObject);
  };

  type GroupedFormContent = {
    description?: string;
    fields: { [key: string]: { [key: string]: any } };
    title: string;
  };

  const generateContent = (selectedColumns: SelectedColumnsRecord) => {
    const resContent = [];

    for (const columnId in selectedColumns) {
      const currContent: GroupedFormContent = {
        description:
          selectedColumns[columnId]?.description ?? `Configuration for column "${selectedColumns[columnId]!.name}"`,
        fields: {},
        title: `${selectedColumns[columnId]!.name}`
      };
      currContent.fields[columnId] = {
        kind: 'boolean',
        label: `Add configuration for column "${selectedColumns[columnId]!.name}"?`,
        variant: 'checkbox'
      };

      currContent.fields[columnId + 'HashLength'] = {
        deps: [columnId],
        kind: 'dynamic',
        render(data: { [key: string]: any }) {
          if (!data[columnId]) {
            return null;
          } else {
            return {
              kind: 'number',
              label: 'Hash Length',
              variant: 'input'
            };
          }
        }
      };

      currContent.fields[columnId + 'HashSalt'] = {
        deps: [columnId],
        kind: 'dynamic',
        render(data: { [key: string]: any }) {
          if (!data[columnId]) {
            return null;
          } else {
            return {
              kind: 'string',
              label: 'Hash Salt',
              variant: 'input'
            };
          }
        }
      };

      currContent.fields[columnId + 'TrimStart'] = {
        deps: [columnId],
        kind: 'dynamic',
        render(data: { [key: string]: any }) {
          if (!data[columnId]) {
            return null;
          } else {
            return {
              kind: 'number',
              label: 'Trim Start',
              variant: 'input'
            };
          }
        }
      };

      currContent.fields[columnId + 'TrimEnd'] = {
        deps: [columnId],
        kind: 'dynamic',
        render(data: { [key: string]: any }) {
          if (!data[columnId]) {
            return null;
          } else {
            return {
              kind: 'number',
              label: 'Trim End',
              variant: 'input'
            };
          }
        }
      };

      resContent.push(currContent);
    }

    return resContent;
  };

  const formValidation = generateValidationSchema(selectedColumns);
  const formContent = generateContent(selectedColumns);

  const handleSubmit = (data: z.infer<ReturnType<typeof generateValidationSchema>>) => {
    for (const columnId in selectedColumns) {
      if (data[columnId]) {
        const currentColumnConfig: ProjectDatasetColumnConfig = {
          hash: {
            length: 0,
            salt: ''
          },
          trim: {
            start: 0
          }
        };
        currentColumnConfig.hash.length = (data[columnId + 'HashLength'] as number) ?? 0;
        currentColumnConfig.hash.salt = (data[columnId + 'HashSalt'] as string) ?? '';
        currentColumnConfig.trim.start = (data[columnId + 'TrimStart'] as number) ?? 0;
        if (data[columnId + 'TrimEnd']) {
          currentColumnConfig.trim.end = data[columnId + 'TrimEnd'] as number;
        }
        setColumnsConfig(columnId, currentColumnConfig);
      }
    }
  };

  return (
    <Form
      className="w-full"
      content={formContent}
      validationSchema={formValidation}
      onSubmit={(data) => handleSubmit(data)}
    />
  );
};
