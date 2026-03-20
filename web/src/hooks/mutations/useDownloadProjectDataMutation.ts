import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useDownloadProjectDataMutation() {
  return useMutation({
    mutationFn: ({ datasetId, format, projectId }: { datasetId: string; format: 'CSV' | 'TSV'; projectId: string }) =>
      axios.get<string>(`/v1/projects/download-data/${projectId}/${datasetId}/${format}`)
  });
}
