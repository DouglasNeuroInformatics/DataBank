/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable perfectionist/sort-objects */

import { useEffect, useState } from 'react';

import type { AddProjectDatasetColumns, ProjectColumn, ProjectDatasetDto } from '@databank/types';
import { Form } from '@douglasneuroinformatics/libui/components';
import axios from 'axios';
import { type RouteObject, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

const AddProjectDatasetColumnPage = () => {
  const params = useParams();
  const [columns, setColumns] = useState<AddProjectDatasetColumns | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<AddProjectDatasetColumns>(`/v1/datasets/columns/${params.datasetId}`)
      .then((response) => {
        setColumns(response.data);
      })
      .catch(console.error);
  }, []);

  const columnNames = Object.keys(columns ?? {});
  const formOptions: { [key: string]: string } = {};
  columnNames.forEach((columnName) => {
    formOptions[columnName] = columnName;
  });

  const contentHashKeys: string[] = [];
  const contentHashSaltKeys: string[] = [];
  const contentHashLengthKeys: string[] = [];
  const contentTrimKeys: string[] = [];
  const contentTrimStartKeys: string[] = [];
  const contentTrimEndKeys: string[] = [];

  const generateValidationSchema = (colNames: string[]) => {
    const resSchema: { [key: string]: any } = {
      selected: z.set(z.string()),
      useRowFilter: z.boolean(),
      rowMin: z.number().optional(),
      rowMax: z.number().optional()
    };
    colNames.forEach((colName) => {
      const useHashEntryName = colName + 'Hash';
      resSchema[useHashEntryName] = z.boolean().optional();
      contentHashKeys.push(useHashEntryName);
      const hashSaltName = colName + 'HashSalt';
      resSchema[hashSaltName] = z.string().optional();
      contentHashSaltKeys.push(hashSaltName);
      const hashLengthName = colName + 'HashLength';
      resSchema[hashLengthName] = z.number().min(1).optional();
      contentHashLengthKeys.push(hashLengthName);
      const useTrimEntryName = colName + 'Trim';
      resSchema[useTrimEntryName] = z.boolean().optional();
      contentTrimKeys.push(useTrimEntryName);
      const trimStartName = colName + 'TrimStart';
      resSchema[trimStartName] = z.number().min(0).optional();
      contentTrimStartKeys.push(trimStartName);
      const trimEndName = colName + 'TrimEnd';
      resSchema[trimEndName] = z.number().optional();
      contentTrimEndKeys.push(trimEndName);
    });
    return z.object(resSchema);
  };

  const generateContent = () => {
    const resContent: { [key: string]: any } = {
      selected: {
        kind: 'set',
        label: 'Columns to Add',
        options: formOptions,
        variant: 'listbox'
      },
      useRowFilter: {
        kind: 'boolean',
        variant: 'radio',
        label: 'Do you want to use row filter?'
      },
      rowMin: {
        deps: ['useRowFilter'],
        kind: 'dynamic',
        render: (data: { useRowFilter: boolean | null }) => {
          if (!data.useRowFilter) {
            return null;
          } else {
            return {
              kind: 'number',
              label: 'Min Row Number',
              variant: 'input'
            };
          }
        }
      },
      rowMax: {
        deps: ['useRowFilter'],
        kind: 'dynamic',
        render: (data: { useRowFilter: boolean | null }) => {
          if (!data.useRowFilter) {
            return null;
          } else {
            return {
              kind: 'number',
              label: 'Max Row Number',
              variant: 'input'
            };
          }
        }
      }
    };

    contentHashKeys.forEach((hashKey) => {
      resContent[hashKey] = {
        deps: ['selected'],
        kind: 'dynamic',
        render: (data: { selected: { has: (arg0: string) => any } }) => {
          if (!data.selected) {
            return null;
          }
          if (data.selected.has(hashKey.slice(0, -4))) {
            return {
              kind: 'boolean',
              label: hashKey,
              variant: 'radio'
            };
          } else {
            return null;
          }
        }
      };
    });

    contentHashSaltKeys.forEach((key) => {
      resContent[key] = {
        deps: [key.slice(0, -4)],
        kind: 'dynamic',
        render: (data: { [x: string]: any }) => {
          if (data[key.slice(0, -4)]) {
            return {
              kind: 'string',
              label: key,
              variant: 'input'
            };
          } else {
            return null;
          }
        }
      };
    });

    contentHashLengthKeys.forEach((key) => {
      resContent[key] = {
        deps: [key.slice(0, -6)],
        kind: 'dynamic',
        render: (data: { [x: string]: any }) => {
          if (data[key.slice(0, -6)]) {
            return {
              kind: 'number',
              label: key,
              variant: 'input'
            };
          } else {
            return null;
          }
        }
      };
    });

    contentTrimKeys.forEach((hashKey) => {
      resContent[hashKey] = {
        deps: ['selected'],
        kind: 'dynamic',
        render: (data: { selected: { has: (arg0: string) => any } }) => {
          if (!data.selected) {
            return null;
          }
          if (data.selected.has(hashKey.slice(0, -4))) {
            return {
              kind: 'boolean',
              label: hashKey,
              variant: 'radio'
            };
          } else {
            return null;
          }
        }
      };
    });

    contentTrimStartKeys.forEach((key) => {
      resContent[key] = {
        deps: [key.slice(0, -5)],
        kind: 'dynamic',
        render: (data: { [x: string]: any }) => {
          if (data[key.slice(0, -5)]) {
            return {
              kind: 'number',
              label: key,
              variant: 'input'
            };
          } else {
            return null;
          }
        }
      };
    });

    contentTrimEndKeys.forEach((key) => {
      resContent[key] = {
        deps: [key.slice(0, -3)],
        kind: 'dynamic',
        render: (data: { [x: string]: any }) => {
          if (data[key.slice(0, -3)]) {
            return {
              kind: 'number',
              label: key,
              variant: 'input'
            };
          } else {
            return null;
          }
        }
      };
    });

    return resContent;
  };

  const formValidation = generateValidationSchema(columnNames);
  const formContent = generateContent();

  const handleSubmit = (data: { [x: string]: any }) => {
    const projectDatasetDto: ProjectDatasetDto = {
      columns: [],
      dataTypeFilters: [],
      datasetId: params.datasetId!,
      rowFilter: {
        rowMax: (data.rowMax as number) ?? null,
        rowMin: (data.rowMin as number) ?? null
      },
      useDataTypeFilter: false,
      useRowFilter: data.useRowFilter as boolean
    };

    data.selected.keys().forEach((colName: any) => {
      const currProjectColumn: ProjectColumn = {
        columnId: columns![colName]!,
        hash: null,
        trim: null
      };

      if (data[colName + 'Hash']) {
        currProjectColumn.hash = {
          salt: data[colName + 'HashSalt'],
          length: data[colName + 'HashLength']
        };
      }

      if (data[colName + 'Trim']) {
        currProjectColumn.trim = {
          start: data[colName + 'TrimStart'],
          end: data[colName + 'TrimEnd']
        };
      }

      projectDatasetDto.columns.push(currProjectColumn);
    });

    void axios.post(`/v1/projects/add-dataset/${params.projectId}`, {
      projectDatasetDto
    });
    navigate(`/portal/project/${params.projectId}`);
  };

  return <Form content={formContent} validationSchema={formValidation} onSubmit={(data) => handleSubmit(data)} />;
};

export const AddProjectDatasetColumnRoute: RouteObject = {
  element: <AddProjectDatasetColumnPage />,
  path: 'project/add-columns/:projectId/:datasetId'
};
