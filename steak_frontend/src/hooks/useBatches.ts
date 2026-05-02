import { useQuery } from '@tanstack/react-query';
import { useSteakProgram } from './useSteakProgram';
import { BatchAccount, ProgramAccount } from '../types/steak';

export const useBatches = () => {
  const program = useSteakProgram();

  return useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      if (!program) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const account = program.account as any;
      const batches = await account.batch.all();
      return batches as ProgramAccount<BatchAccount>[];
    },
    enabled: !!program,
  });
};
