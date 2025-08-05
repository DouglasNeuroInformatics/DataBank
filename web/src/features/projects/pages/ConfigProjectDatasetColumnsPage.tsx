import { useCallback } from 'react';

import type { ProjectDatasetColumnConfig } from '@databank/core';
import type FormTypes from '@douglasneuroinformatics/libui-form-types';
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
  const generateValidationSchema = useCallback(() => {
    const formValidationObject: { [key: string]: any } = {};

    for (const columnId in selectedColumns) {
      formValidationObject[columnId] = z.boolean().default(false);
      formValidationObject[columnId + 'HashLength'] = z.number().int().gte(0).optional();
      formValidationObject[columnId + 'HashSalt'] = z.string().optional();
      formValidationObject[columnId + 'TrimStart'] = z.number().int().gte(0).optional();
      formValidationObject[columnId + 'TrimEnd'] = z.number().int().gte(0).optional();
    }
    return z.object(formValidationObject) as z.ZodType<FormTypes.Data>;
  }, [selectedColumns]);

  const generateContent = useCallback(() => {
    const resContent = [];

    for (const columnId in selectedColumns) {
      const currContent: FormTypes.FieldsGroup<FormTypes.Data> = {
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
  }, []);

  const formValidation = generateValidationSchema();
  const formContent = generateContent();

  const handleSubmit = (data: z.infer<ReturnType<typeof generateValidationSchema>>) => {
    for (const columnId in selectedColumns) {
      if (data[columnId]) {
        // if data[columnId] means that the user selected to add config to the column
        const currentColumnConfig: ProjectDatasetColumnConfig = {
          hash: null,
          trim: null
        };
        if (data[columnId + 'HashLength'] === 0 || data[columnId + 'HashLength']) {
          currentColumnConfig.hash = {
            length: data[columnId + 'HashLength'] as number,
            salt: (data[columnId + 'HashSalt'] as string) ?? null
          };
        }

        if (data[columnId + 'TrimStart'] === 0 || data[columnId + 'TrimStart']) {
          currentColumnConfig.trim = {
            end: (data[columnId + 'TrimEnd'] as number) ?? null,
            start: data[columnId + 'TrimStart'] as number
          };
        }
        setColumnsConfig(columnId, currentColumnConfig);
      }
    }
  };

  return <Form className="w-full" content={formContent} validationSchema={formValidation} onSubmit={handleSubmit} />;
};
