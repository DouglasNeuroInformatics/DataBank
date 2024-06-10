/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { RouteObject } from 'react-router-dom';

const ManageDatasetsPage = () => {
  return (
    <>
      <h1>Manage Dataset</h1>
    </>
  );
};

export const manageDatasetsRoute: RouteObject = {
  path: 'manage',
  element: <ManageDatasetsPage />
};
