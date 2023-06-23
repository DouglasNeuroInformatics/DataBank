import { useEffect, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import axios from 'axios';

import { useAuthStore } from '@/stores/auth-store';

/**
 * Returns an array of info about available datasets
 * @param options.onlyCurrentUser - if true, then only datasets owned by the current user will be returned
 * @returns
 */
export function useAvailableDatasets(options?: { onlyCurrentUser?: boolean }) {
  const auth = useAuthStore();
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([]);

  console.log(auth.currentUser);

  const fetchAvailable = async () => {
    //const url = '/v1/datasets/available' + options?.onlyCurrentUser ? `?owner=${auth.currentUser.}`
    const response = await axios.get<DatasetInfo[]>('/v1/datasets/available');
    setAvailableDatasets(response.data);
  };

  useEffect(() => {
    void fetchAvailable();
  }, [auth.currentUser]);

  return availableDatasets;
}
