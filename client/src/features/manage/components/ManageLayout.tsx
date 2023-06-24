import { useEffect, useMemo, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import { SearchBar } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import { DatasetCard } from '@/components/DatasetCard';
import { Heading } from '@/components/Heading';
import { useAuthStore } from '@/stores/auth-store';

export const ManageLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get<DatasetInfo[]>(`/v1/datasets/available?owner=${currentUser!.id}`)
      .then((response) => setAvailableDatasets(response.data))
      .catch(console.error);
  }, [currentUser]);

  const filteredDatasets = useMemo(() => {
    return availableDatasets.filter((dataset) => dataset.name.toUpperCase().includes(searchTerm.toUpperCase()));
  }, [availableDatasets, searchTerm]);

  return (
    <div className="flex h-full w-full flex-col">
      <Heading title={t('manageDatasets')} />
      <div className="w-full">
        <SearchBar
          className="mb-3 rounded-sm"
          size="sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-5 overflow-y-hidden">
        <div className="flex w-1/3 flex-col 2xl:w-1/4">
          <ul className="h-full divide-y divide-slate-300 overflow-scroll rounded-sm" role="list">
            {filteredDatasets.map((dataset) => (
              <li key={dataset._id}>
                <DatasetCard dataset={dataset} onClick={() => navigate(dataset._id)} />
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 2xl:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
