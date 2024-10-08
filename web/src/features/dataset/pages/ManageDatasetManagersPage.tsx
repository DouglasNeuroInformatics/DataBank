import { Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { type RouteObject, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import ManagerCard from '../components/ManagerCard';

const ManageDatasetManagersPage = () => {
  const location = useLocation();
  const { t } = useTranslation('common');
  const { datasetId, isManager, managerIds } = location.state as {
    datasetId: string;
    isManager: boolean;
    managerIds: string[];
  };
  const notifications = useNotificationsStore();
  const navigate = useNavigate();

  const addManager = (managerEmailToAdd: string) => {
    axios
      .patch(`/v1/datasets/managers/${datasetId}/${managerEmailToAdd}`)
      .then(() => {
        notifications.addNotification({
          message: `User with Email ${managerEmailToAdd} has been added to the current dataset`,
          type: 'success'
        });
        navigate(`/portal/dataset/${datasetId}`);
      })
      .catch(console.error);
  };

  return (
    <>
      <Form
        content={{
          newManagerEmail: {
            kind: 'string',
            label: t('newManagerEmail'),
            variant: 'input'
          }
        }}
        submitBtnLabel={t('addManager')}
        validationSchema={z.object({
          newManagerEmail: z.string().email()
        })}
        onSubmit={(data) => {
          addManager(data.newManagerEmail);
        }}
      />
      <ul>
        {managerIds.map((managerId, i) => {
          return (
            <li key={i}>
              <ManagerCard
                datasetId={datasetId}
                isManager={managerIds.length > 1 ? isManager : false}
                managerId={managerId}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const ManageDatasetManagersRoute: RouteObject = {
  element: <ManageDatasetManagersPage />,
  path: 'manageDatasetManager'
};
