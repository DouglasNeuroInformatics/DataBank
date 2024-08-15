/* eslint-disable perfectionist/sort-objects */
import React, { useEffect } from 'react';

import { type RouteObject } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

const AddProjectDatasetPage = () => {
  // display all datasets the current user has (name, id, description)
  // and then enter the columns to add to the project
  const { currentUser } = useAuthStore();
  useEffect(() => {
    currentUser?.id;
  }, []);
  return (
    <>
      <h1>Add Dataset to Project</h1>
    </>
  );
};

export const AddProjectDatasetRoute: RouteObject = {
  path: 'project/addDataset',
  element: <AddProjectDatasetPage />
};
