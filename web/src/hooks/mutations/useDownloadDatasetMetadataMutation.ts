import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useDownloadDatasetMetadataMutation() {
  return useMutation({
    mutationFn: ({ datasetId, format }: { datasetId: string; format: 'CSV' | 'TSV' }) =>
      axios.get<string>(`/v1/datasets/download-metadata/${datasetId}/${format}`)
  });
}
