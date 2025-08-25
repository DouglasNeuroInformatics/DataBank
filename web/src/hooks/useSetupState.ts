import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

const $SetupState = z.object({
  isSetup: z.boolean()
});

export function useSetupState() {
  return useQuery({
    queryFn: async () => {
      const response = await axios.get('/v1/setup');
      return $SetupState.parseAsync(response.data);
    },
    queryKey: ['setup-state']
  });
}
