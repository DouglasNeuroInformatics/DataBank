/* eslint-disable perfectionist/sort-objects */
import { useCallback } from 'react';

import { $DatasetLicenses, $EditDatasetInfo, $PermissionLevel } from '@databank/core';
import { Button, Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { useEditDatasetInfoMutation } from '@/hooks/mutations/useEditDatasetInfoMutation';
import { useDebounceLicensesFilter } from '@/hooks/useDebounceLicensesFilter';

const $EditDatasetInfoDto = z.object({
  description: z.string().optional(),
  isOpenSource: z.boolean().optional(),
  license: $DatasetLicenses.optional(),
  name: z.string().optional(),
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']).optional(),
  searchLicenseString: z.string().optional()
});

const $EditDatasetInfoSearchParams = z.object({
  description: z.string().optional(),
  license: z.string(),
  name: z.string(),
  permission: $PermissionLevel
});

const RouteComponent = () => {
  const { datasetId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { subscribe, licenseOptions } = useDebounceLicensesFilter();
  const { name, description, permission, license } = Route.useSearch();
  const editDatasetInfoMutation = useEditDatasetInfoMutation();

  const permissionOption = { LOGIN: 'LOGIN', MANAGER: 'MANAGER', PUBLIC: 'PUBLIC', VERIFIED: 'VERIFIED' };

  const handleSubmit = useCallback(
    (data: $EditDatasetInfo) => {
      editDatasetInfoMutation.mutate(
        { datasetId, editDatasetInfoDto: data },
        {
          onSuccess() {
            void navigate({ to: '/portal/datasets/$datasetId', params: { datasetId } });
          }
        }
      );
    },
    [datasetId]
  );

  return (
    <div className="mx-auto max-w-xl">
      <PageHeading
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => void navigate({ to: '/portal/datasets/$datasetId', params: { datasetId } })}
          >
            <ArrowLeftIcon className="mr-1.5 size-3.5" />
            {t({
              en: 'Back to Dataset',
              fr: 'Retour au jeu de données'
            })}
          </Button>
        }
      >
        {t('editDatasetInfo')}
      </PageHeading>
      <Form
        content={[
          {
            description: 'Basic dataset information details',
            fields: {
              name: { kind: 'string', label: 'New Dataset Name', variant: 'input', placeholder: name },
              description: {
                kind: 'string',
                label: 'New Dataset Description',
                variant: 'input',
                placeholder: description
              },
              permission: {
                kind: 'string',
                label: `Permission (Current: ${permission})`,
                options: permissionOption,
                variant: 'select'
              }
            },
            title: 'Basic Dataset Information'
          },
          {
            description: 'Select a license for your dataset',
            fields: {
              isOpenSource: { kind: 'boolean', label: 'Is License Open Source', variant: 'radio' },
              searchLicenseString: { kind: 'string', label: 'Search for licenses', variant: 'input' },
              license: {
                kind: 'string',
                label: `Select License (Current: ${license})`,
                options: licenseOptions,
                variant: 'select'
              }
            },
            title: 'Dataset License'
          }
        ]}
        resetBtn={true}
        subscribe={subscribe}
        validationSchema={$EditDatasetInfoDto}
        onSubmit={(data) => handleSubmit(data)}
      />
    </div>
  );
};

export const Route = createFileRoute('/portal/datasets/$datasetId/edit')({
  validateSearch: $EditDatasetInfoSearchParams,
  component: RouteComponent
});
