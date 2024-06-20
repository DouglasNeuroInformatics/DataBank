/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { RouteObject } from 'react-router-dom';

const ManageProjectPage = () => {
  return (
    <>
      <h1>Manage Project</h1>
    </>
  );
};

export const manageProjectRoute: RouteObject = {
  path: 'project',
  element: <ManageProjectPage />
};
