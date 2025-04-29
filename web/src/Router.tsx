// /* eslint-disable perfectionist/sort-objects */

// import { BrowserRouter, useRoutes } from 'react-router-dom';
// import type { RouteObject } from 'react-router-dom';

import { editDatasetInfoRoute } from './features/dataset/pages/EditDatasetInfoPage';
import { manageDatasetManagersRoute } from './features/dataset/pages/ManageDatasetManagersPage';
import { viewOneDatasetRoute } from './features/dataset/pages/ViewOneDatasetPage';
import { addProjectDatasetColumnRoute } from './features/projects/pages/AddProjectDatasetColumnPage';
import { addProjectDatasetRoute } from './features/projects/pages/AddProjectDatasetPage';
import { createProjectRoute } from './features/projects/pages/CreateProjectPage';
import { editProjectInfoRoute } from './features/projects/pages/EditProjectInfoPage';
import { manageProjectUsersRoute } from './features/projects/pages/ManageProjectUsersPage';
import { viewOneProjectDatasetRoute } from './features/projects/pages/ViewOneProjectDatasetPage';
import { viewOneProjectRoute } from './features/projects/pages/ViewOneProjectPage';
import { viewProjectsRoute } from './features/projects/pages/ViewProjectsPage';
// import { useAuthStore } from './stores/auth-store';

// const protectedRoutes: RouteObject[] = [
//       createDatasetRoute,
//       viewOneDatasetRoute,
//       viewOneProjectDatasetRoute,
//       viewProjectsRoute,
//       viewOneProjectRoute,
//       createProjectRoute,
//       addProjectDatasetRoute,
//       manageDatasetManagersRoute,
//       manageProjectUsersRoute,
//       editDatasetInfoRoute,
//       editProjectInfoRoute,
//       addProjectDatasetColumnRoute
//     ]

// const AppRoutes = () => {
//   /**
//    * component to return the routes depending on the state of the access token
//    * in the auth store
//    *
//    * at the first render, if the environment is DEV and the developer configured
//    * the app to bypass auth, then a post request will be send to the backend to
//    * fake the creation of a user and get back an access token
//    */
//   const { accessToken } = useAuthStore();

//   return useRoutes(accessToken ? protectedRoutes : publicRoutes);
// };

// export const Router = () => {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// };
