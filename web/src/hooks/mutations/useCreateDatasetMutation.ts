import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useCreateDatasetMutation() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      axios.post('/v1/datasets/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
  });
}
