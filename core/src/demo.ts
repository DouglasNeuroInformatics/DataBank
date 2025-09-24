import { deepFreeze } from '@douglasneuroinformatics/libjs';

import { $LoginCredentials } from './auth';
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

const createDemoDatasetDto: $CreateDataset = deepFreeze({
  datasetType: 'TABULAR',
  description: 'Demo dataset to show various properties of DataBank',
  isJSON: 'false',
  isReadyToShare: 'false',
  license: 'CC0-1.0',
  name: 'Demo Dataset',
  permission: 'MANAGER',
  primaryKeys: 'name, date_of_birth'
});

const dataManagerLoginCredentials: $LoginCredentials = deepFreeze({
  email: 'data-manager@example.org',
  password: 'data-manager-dnp'
});

const loginUserLoginCredentials: $LoginCredentials = deepFreeze({
  email: 'login-user@example.org',
  password: 'login-user-dnp'
});

const verifiedUserLoginCredentials: $LoginCredentials = deepFreeze({
  email: 'verified-user@example.org',
  password: 'verified-user-dnp'
});
export {
  createDemoDatasetDto,
  dataManagerLoginCredentials,
  DEMO_USERS,
  loginUserLoginCredentials,
  verifiedUserLoginCredentials
};
