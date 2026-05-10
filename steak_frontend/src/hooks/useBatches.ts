import { useQuery } from '@tanstack/react-query';
import { useSteakProgram } from './useSteakProgram';
import { BatchAccount, ProgramAccount } from '../types/steak';

export const useBatches = () => {
  const program = useSteakProgram();

  return useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      if (!program) return [];

      const allAccounts = await program.provider.connection.getProgramAccounts(program.programId);
      const validBatches = [];

      for (const acc of allAccounts) {
        try {
          // Hanya decode akun yang benar-benar Batch dan sesuai dengan IDL terbaru
          const parsed = program.coder.accounts.decode('batch', acc.account.data);
          validBatches.push({ publicKey: acc.pubkey, account: parsed });
        } catch {
          // Abaikan akun lama yang formatnya beda atau akun jenis lain (seperti GlobalState)
        }
      }

      // Urutkan berdasarkan batchId agar berurutan
      validBatches.sort((a, b) => Number(a.account.batchId) - Number(b.account.batchId));

      return validBatches as ProgramAccount<BatchAccount>[];
    },
    enabled: !!program,
  });
};
