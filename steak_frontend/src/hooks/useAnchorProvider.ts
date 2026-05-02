import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';

export const useAnchorProvider = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMemo(() => {
    // If wallet is not connected, we still might want a read-only provider
    // but Anchor's Program needs a provider with a wallet for transactions.
    // We can use a mock wallet for read-only if needed.
    return new anchor.AnchorProvider(connection, wallet as unknown as anchor.Wallet, {
      preflightCommitment: 'confirmed',
    });
  }, [connection, wallet]);
};
