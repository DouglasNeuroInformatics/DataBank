import { deepFreeze } from '@douglasneuroinformatics/libjs';

import { $CreateDataset } from './datasets';
import { $CreateUser } from './users';

const DEMO_USERS = deepFreeze<$CreateUser[]>([
  {
    confirmedAt: new Date(),
    datasetId: [],
    email: 'data-manager@example.org',
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'data-manager-dnp',
    verifiedAt: new Date()
  },
  {
    confirmedAt: new Date(),
    datasetId: [],
    email: 'login-user@example.org',
    firstName: 'John',
    lastName: 'Smith',
    password: 'login-user-dnp'
  },
  {
    confirmedAt: new Date(),
    datasetId: [],
    email: 'verified-user@example.org',
    firstName: 'François',
    lastName: 'Bouchard',
    password: 'verified-user-dnp',
    verifiedAt: new Date()
  }
]);

const createDemoDatasetDto: $CreateDataset = {
  datasetType: 'TABULAR',
  description: 'Demo dataset to show various properties of DataBank',
  isJSON: 'false',
  isReadyToShare: 'false',
  license: 'CC0-1.0',
  name: 'Demo Dataset',
  permission: 'MANAGER',
  primaryKeys: 'name, date_of_birth'
};
export { createDemoDatasetDto, DEMO_USERS };
