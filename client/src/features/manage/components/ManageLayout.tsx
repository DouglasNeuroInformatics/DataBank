import { useEffect, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';

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

  return (
    <div className="flex h-full w-full flex-col">
      <Heading title="Manage Datasets" />
      <div className="flex h-full gap-5 overflow-hidden">
        <div className="h-full w-1/4 border border-dashed">
          <ul className="h-full divide-y divide-slate-300 overflow-scroll" role="list">
            {availableDatasets.map((dataset) => (
              <li key={dataset._id}>
                <DatasetCard dataset={dataset} onClick={() => navigate(dataset._id)} />
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4 border border-dashed p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
