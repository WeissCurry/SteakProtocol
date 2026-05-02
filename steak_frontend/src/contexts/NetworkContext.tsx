import { createContext, useContext } from 'react';

export type Network = 'devnet' | 'mainnet-beta' | 'localnet';

export interface NetworkContextState {
  network: Network;
  setNetwork: (network: Network) => void;
}

export const NetworkContext = createContext<NetworkContextState | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a SolanaProvider');
  }
  return context;
};
