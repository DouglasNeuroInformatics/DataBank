import React from 'react';

import type { ProjectDatasetDto } from '@databank/types';
import axios from 'axios';
import { type RouteObject, useParams } from 'react-router-dom';

const AddProjectDatasetColumnPage = () => {
  const params = useParams();

  const handleAddDatasetToProject = (datasetId: string, projectDatasetDto: ProjectDatasetDto) => {
    void axios
      .post(`/v1/projects/add-dataset/${params.projectId}`, {
        projectDatasetDto
      })
      .then()
      .catch();
  };
  params.projectId;
  params.datasetId;
  return <></>;
};

export const AddProjectDatasetColumnRoute: RouteObject = {
  element: <AddProjectDatasetColumnPage />,
  path: 'project/add-columns/:projectId/:datasetId'
};
