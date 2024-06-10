/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { RouteObject } from 'react-router-dom';

const ViewPublicDatasetsPage = () => {
  return (
    <>
      <h1>Public datasets</h1>
    </>
  );
};

export const viewPublicDatasetsRoute: RouteObject = {
  path: 'get-all',
  element: <ViewPublicDatasetsPage />
};
