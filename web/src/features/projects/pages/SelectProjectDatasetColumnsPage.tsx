import { useEffect, useState } from 'react';

import type { ProjectColumnSummary, ProjectDatasetConfigStep } from '@databank/core';
import axios from 'axios';

import { LoadingFallback } from '@/components';

import { ProjectColumnsTable } from '../components/ProjectColumnsTable';
import { projectColumnDefs } from '../components/ProjectSelectColumns';

import type { SelectedColumnsRecord } from '../store/useProjectDatasetConfigStoreFactory';

type SelectProjectDatasetColumnsPagePros = {
  datasetId: string;
  projectId: string;
  reset: () => void;
  setCurrentStep: (step: ProjectDatasetConfigStep) => void;
  setSelectedColumns: (selectedColumnIds: SelectedColumnsRecord) => void;
};

export const SelectProjectDatasetColumnsPage = ({
  datasetId,
  projectId,
  setSelectedColumns
}: SelectProjectDatasetColumnsPagePros) => {
  const [data, setData] = useState<ProjectColumnSummary[]>([]);

  useEffect(() => {
    axios
      .get<ProjectColumnSummary[]>(`/v1/datasets/columns/${datasetId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch(console.error);
  }, [datasetId]);

  return (
    <div className="container mx-auto py-10">
      {data.length > 0 ? (
        <ProjectColumnsTable columns={projectColumnDefs} data={data} setSelectedColumns={setSelectedColumns} />
      ) : (
        <LoadingFallback />
      )}
    </div>
  );
};
