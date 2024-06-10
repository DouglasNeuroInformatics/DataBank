/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { RouteObject } from 'react-router-dom';

const ViewDatasetsPage = () => {
  return (
    <>
      <h1>Datasets</h1>
    </>
  );
};

export const datasetsRoute: RouteObject = {
  path: 'get-all',
  element: <ViewDatasetsPage />
};
