import React from 'react';

// import type { ProjectDatasetDto } from '@databank/types';
import { Form } from '@douglasneuroinformatics/libui/components';
// import axios from 'axios';
import { type RouteObject, useParams } from 'react-router-dom';
import { z } from 'zod';

const AddProjectDatasetColumnPage = () => {
  const params = useParams();

  const columnNames = ['col1Name', 'col2Name', 'col3Name', 'col4Name', 'col5Name'];

  // a function will handle this return
  const formOptions = {
    col1Name: 'col1Name',
    col2Name: 'col2Name',
    col3Name: 'col3Name',
    col4Name: 'col4Name',
    col5Name: 'col5Name'
  };

  const contentHashKeys: string[] = [];
  const contentHashSaltKeys: string[] = [];
  const contentHashLengthKeys: string[] = [];
  const contentTrimKeys: string[] = [];
  const contentTrimStartKeys: string[] = [];
  const contentTrimEndKeys: string[] = [];

  const generateValidationSchema = (colNames: string[]) => {
    const resSchema: { [key: string]: any } = {};
    colNames.forEach((colName) => {
      const useHashEntryName = colName + 'Hash';
      resSchema[useHashEntryName] = z.boolean().optional();
      contentHashKeys.push(useHashEntryName);
      const hashSaltName = colName + 'HashSalt';
      resSchema[hashSaltName] = z.string().optional();
      contentHashSaltKeys.push(hashSaltName);
      const hashLengthName = colName + 'HashLength';
      resSchema[hashLengthName] = z.number().optional();
      contentHashLengthKeys.push(hashLengthName);
      const useTrimEntryName = colName + 'Trim';
      resSchema[useTrimEntryName] = z.string().optional();
      contentTrimKeys.push(useTrimEntryName);
      const trimStartName = colName + 'TrimStart';
      resSchema[trimStartName] = z.string().optional();
      contentTrimStartKeys.push(trimStartName);
      const trimEndName = colName + 'TrimEnd';
      resSchema[trimEndName] = z.string().optional();
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

  // const handleAddDatasetToProject = (datasetId: string, projectDatasetDto: ProjectDatasetDto) => {
  //     void axios
  //         .post(`/v1/projects/add-dataset/${params.projectId}`, {
  //             projectDatasetDto
  //         })
  //         .then()
  //         .catch();
  // };

  const handleSubmit = (data: any) => {
    data;
    //
  };
  params.projectId;
  params.datasetId;
  return <Form content={formContent} validationSchema={formValidation} onSubmit={(data) => handleSubmit(data)} />;
};

export const AddProjectDatasetColumnRoute: RouteObject = {
  element: <AddProjectDatasetColumnPage />,
  path: 'project/add-columns/:projectId/:datasetId'
};
