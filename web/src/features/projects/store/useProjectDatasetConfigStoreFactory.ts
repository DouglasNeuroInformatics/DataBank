import {
  $ProjectAddDatasetConfig,
  $ProjectDatasetColumnConfig,
  $ProjectDatasetConfigStep,
  $ProjectDatasetRowConfig,
  $ProjectDatasetSelectedColumn
} from '@databank/core';
import { produce } from 'immer';
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
  const emptyConfigState: $ProjectAddDatasetConfig = {
    columnsConfig: {},
    currentColumnIdIndex: 0,
    currentStep: 'selectColumns',
    pageSize: 10,
    rowConfig: { rowMax: null, rowMin: 0 },
    selectedColumns: {}
  };

  const baseStore = persist<ProjectDatasetConfigStore>(
    (set) => ({
      columnsConfig: {},
      currentColumnIdIndex: 0,
      currentStep: 'selectColumns',
      pageSize: 10,
      reset: () => set(emptyConfigState),
      rowConfig: {
        rowMax: null,
        rowMin: 0
      },
      selectedColumns: {},
      setColumnsConfig: (id, colConfig) =>
        set((state) =>
          produce(state, (draft) => {
            draft.columnsConfig[id] = colConfig;
          })
        ),
      setCurrentColumnIdIndex: (ind) =>
        set((state) =>
          produce(state, (draft) => {
            draft.currentColumnIdIndex = ind;
          })
        ),
      setPageSize: (size) =>
        set((state) =>
          produce(state, (draft) => {
            draft.pageSize = size;
          })
        ),
      setRowConfig: (newRowConfig) =>
        set((state) =>
          produce(state, (draft) => {
            draft.rowConfig = newRowConfig;
          })
        ),
      setSelectedColumns: (newSelectedCols) =>
        set((state) =>
          produce(state, (draft) => {
            draft.selectedColumns = newSelectedCols;
          })
        ),
      setStep: (step) =>
        set((state) =>
          produce(state, (draft) => {
            draft.currentStep = step;
          })
        )
    }),
    { name: configPersistKey }
  );

  return createStore(baseStore);
};

export type { SelectedColumnsRecord };
