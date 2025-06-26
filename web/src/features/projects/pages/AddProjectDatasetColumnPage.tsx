import { useEffect, useState } from 'react';

import type { ProjectColumnSummary } from '@databank/core';
import { useParams } from '@tanstack/react-router';
import axios from 'axios';

import { LoadingFallback } from '@/components';

import { ProjectColumnsTable } from '../components/ProjectColumnsTable';
import { projectColumnDefs } from '../components/ProjectSelectColumns';

const AddProjectDatasetColumnPage = () => {
  // need to get the projectID and datasetID from the route params
  const params = useParams({ strict: false });
  // const navigate = useNavigate();

  const [data, setData] = useState<ProjectColumnSummary[]>([]);

  useEffect(() => {
    axios
      .get<ProjectColumnSummary[]>(`/v1/datasets/columns/${params.datasetId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch(console.error);
  }, [params.projectId, params.datasetId]);

  return (
    <div className="container mx-auto py-10">
      {data.length > 0 ? <ProjectColumnsTable columns={projectColumnDefs} data={data} /> : <LoadingFallback />}
    </div>
  );
};

export default AddProjectDatasetColumnPage;
