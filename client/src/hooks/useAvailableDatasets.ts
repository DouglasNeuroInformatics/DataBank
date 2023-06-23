import { useEffect, useState } from 'react';

import { DatasetInfo } from '@databank/types';
import axios from 'axios';

import { useAuthStore } from '@/stores/auth-store';

/**
 * Returns an array of info about available datasets
 * @param options.onlyCurrentUser - return only datasets owned by the current user
 * @returns
 */
export function useAvailableDatasets(options?: { onlyCurrentUser: boolean }) {
  const auth = useAuthStore();
  const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>([]);

  useEffect(() => {
    axios
      .get<DatasetInfo[]>(`/v1/datasets/available${options?.onlyCurrentUser ? `?owner=${auth.currentUser!.id}` : ''}`)
      .then((response) => setAvailableDatasets(response.data))
      .catch(console.error);
  }, [auth.currentUser]);

  return availableDatasets;
}
