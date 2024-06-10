import { viewPublicDatasetsRoute } from './pages/ViewPublicDatasetsPage';

export const publicDatasetsRoutes: RouteObject = {
  children: [viewPublicDatasetsRoute],
  path: 'datasets'
};
