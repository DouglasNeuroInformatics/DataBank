import {
  $ProjectAddDatasetConfig,
  $ProjectDatasetColumnConfig,
  $ProjectDatasetConfigStep,
  $ProjectDatasetRowConfig,
  $ProjectDatasetSelectedColumn
} from '@databank/core';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

type SelectedColumnsRecord = { [key: string]: $ProjectDatasetSelectedColumn };

type ProjectDatasetConfigStore = $ProjectAddDatasetConfig & {
  reset: () => void;
  setColumnsConfig: (id: string, config: $ProjectDatasetColumnConfig) => void;
  setCurrentColumnIdIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  setRowConfig: (rowConfig: $ProjectDatasetRowConfig) => void;
  setSelectedColumns: (selectedColumns: SelectedColumnsRecord) => void;
  setStep: (step: $ProjectDatasetConfigStep) => void;
};

export const useProjectDatasetConfigStoreFactory = (projectId: string, datasetId: string) => {
  const configPersistKey = `project-dataset-config-${projectId}-${datasetId}`;

  const baseStore = persist<ProjectDatasetConfigStore>(
    (set) => ({
      columnsConfig: {},
      currentColumnIdIndex: 0,
      currentStep: 'selectColumns',
      pageSize: 10,
      reset: () =>
        set({
          columnsConfig: {},
          currentColumnIdIndex: 0,
          currentStep: 'selectColumns',
          pageSize: 10,
          rowConfig: { rowMax: null, rowMin: 0 },
          selectedColumns: {}
        }),
      rowConfig: {
        rowMax: null,
        rowMin: 0
      },
      selectedColumns: {},
      setColumnsConfig: (id, colConfig) =>
        set((state) => ({
          columnsConfig: {
            ...state.columnsConfig,
            [id]: colConfig
          }
        })),
      setCurrentColumnIdIndex: (ind) =>
        set({
          currentColumnIdIndex: ind
        }),
      setPageSize: (size) =>
        set({
          pageSize: size
        }),
      setRowConfig: (newRowConfig) =>
        set({
          rowConfig: newRowConfig
        }),
      setSelectedColumns: (newSelectedCols) =>
        set({
          selectedColumns: newSelectedCols
        }),
      setStep: (step) =>
        set({
          currentStep: step
        })
    }),
    { name: configPersistKey }
  );

  return createStore(baseStore);
};

export type { SelectedColumnsRecord };
