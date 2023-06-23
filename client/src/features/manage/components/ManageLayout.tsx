import { useEffect, useMemo, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import { SearchBar } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';

import { DatasetCard } from '@/components/DatasetCard';
import { Heading } from '@/components/Heading';
import { useAuthStore } from '@/stores/auth-store';

export const ManageLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([]);

  useEffect(() => {
    axios
      .get<DatasetInfo[]>(`/v1/datasets/available?owner=${currentUser!.id}`)
      .then((response) => setAvailableDatasets(response.data))
      .catch(console.error);
  }, [currentUser]);

  const filteredDatasets = useMemo(() => {
    return availableDatasets;
  }, [availableDatasets]);

  return (
    <div className="flex h-full w-full flex-col">
      <Heading title="Manage Datasets" />
      <div className="flex h-full gap-5 overflow-hidden">
        <div className="h-full w-1/3 border border-dashed 2xl:w-1/4">
          <div className="my-2">
            <h3 className="text-lg font-medium">Datasets</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Search total of {availableDatasets.length} datasets
            </p>
          </div>
          <SearchBar />
          <ul className="h-full divide-y divide-slate-300 overflow-scroll" role="list">
            {filteredDatasets.map((dataset) => (
              <li key={dataset._id}>
                <DatasetCard dataset={dataset} onClick={() => navigate(dataset._id)} />
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 border border-dashed p-2 2xl:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
