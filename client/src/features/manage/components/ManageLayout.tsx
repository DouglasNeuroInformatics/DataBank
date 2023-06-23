import { useEffect, useMemo, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import { Button, SearchBar } from '@douglasneuroinformatics/react-components';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';

import { DatasetCard } from '@/components/DatasetCard';
import { Heading } from '@/components/Heading';
import { useAuthStore } from '@/stores/auth-store';

export const ManageLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      <Heading title="Manage Datasets">
        <Button label="Add New" size="sm" />
      </Heading>
      <div className="flex h-full gap-5 overflow-hidden">
        <div className="h-full w-1/3 2xl:w-1/4">
          <SearchBar className="my-3" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <ul className="h-full divide-y divide-slate-300 overflow-scroll" role="list">
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
