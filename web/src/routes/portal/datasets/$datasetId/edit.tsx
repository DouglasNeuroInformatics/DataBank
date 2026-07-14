/* eslint-disable perfectionist/sort-objects */
import { useCallback } from 'react';

import { $DatasetLicenses, $EditDatasetInfo, $PermissionLevel, licenseOptions, licensesObjects } from '@databank/core';
import { Button, Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { useEditDatasetInfoMutation } from '@/hooks/mutations/useEditDatasetInfoMutation';

const $EditDatasetInfoDto = z.object({
  description: z.string().optional(),
  license: $DatasetLicenses.optional(),
  name: z.string().optional(),
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']).optional()
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
    <div className="mx-auto w-full max-w-xl">
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
            description: t({
              en: 'Basic dataset information details',
              fr: 'Détails des informations de base du jeu de données'
            }),
            fields: {
              name: {
                kind: 'string',
                label: t({ en: 'New Dataset Name', fr: 'Nouveau nom du jeu de données' }),
                variant: 'input',
                placeholder: name
              },
              description: {
                kind: 'string',
                label: t({ en: 'New Dataset Description', fr: 'Nouvelle description du jeu de données' }),
                variant: 'input',
                placeholder: description
              },
              permission: {
                kind: 'string',
                label: `${t({ en: 'Permission', fr: 'Permission' })} (${t({ en: 'Current', fr: 'Actuel' })}: ${permission})`,
                options: permissionOption,
                variant: 'select'
              }
            },
            title: t({ en: 'Basic Dataset Information', fr: 'Informations de base du jeu de données' })
          },
          {
            description: t({
              en: 'Search by license name or SPDX identifier',
              fr: 'Recherchez par nom de licence ou identifiant SPDX'
            }),
            fields: {
              license: {
                kind: 'string',
                label: `${t({ en: 'License', fr: 'Licence' })} (${t({ en: 'Current', fr: 'Actuel' })}: ${licensesObjects[license]?.name ?? license})`,
                options: licenseOptions,
                variant: 'combobox'
              }
            },
            title: t({ en: 'Dataset License', fr: 'Licence du jeu de données' })
          }
        ]}
        resetBtn={true}
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
