import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// FIX this messy import, use @databank/schemas instead
import { $SetupDto } from '../../../packages/schemas/src/setup/setup';

export function useSetupState() {
  return useQuery({
    queryFn: async () => {
      const response = await axios.get('/v1/setup');
      return $SetupDto.parseAsync(response.data);
    },
    queryKey: ['setup-state']
  });
}
