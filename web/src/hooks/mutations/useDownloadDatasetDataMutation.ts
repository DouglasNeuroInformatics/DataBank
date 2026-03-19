import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useDownloadDatasetDataMutation() {
  return useMutation({
    mutationFn: ({ datasetId, format }: { datasetId: string; format: 'CSV' | 'TSV' }) =>
      axios.get<string>(`/v1/datasets/download-data/${datasetId}/${format}`)
  });
}
