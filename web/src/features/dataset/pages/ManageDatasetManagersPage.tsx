import { Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';

import ManagerCard from '../components/ManagerCard';

const ManageDatasetManagersPage = () => {
  const route = getRouteApi('/portal/datasets/manage-managers');
  const { t } = useTranslation('common');
  const { datasetId, isManager, managerIds } = route.useSearch();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();

  const addManager = (managerEmailToAdd: string) => {
    axios
      .patch(`/v1/datasets/managers/${datasetId}/${managerEmailToAdd}`)
      .then(() => {
        addNotification({
          message: `User with Email ${managerEmailToAdd} has been added to the current dataset`,
          type: 'success'
        });
        void navigate({ to: `/portal/datasets/${datasetId}` });
      })
      .catch(console.error);
  };

  return (
    <>
      <PageHeading>{t('manageDatasetManagers')}</PageHeading>
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

export { ManageDatasetManagersPage };
