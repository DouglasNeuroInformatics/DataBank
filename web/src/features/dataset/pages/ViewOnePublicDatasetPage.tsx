/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { RouteObject } from 'react-router-dom';

const ViewOnePublicDatasetPage = () => {
  return <h1>Display the selected dataset</h1>;
};

export const viewOnePublicDatasetsRoute: RouteObject = {
  path: 'dataset',
  element: <ViewOnePublicDatasetPage />
};
