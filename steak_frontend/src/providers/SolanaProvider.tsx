import { useMemo, useState, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Network, NetworkContext } from '../contexts/NetworkContext';

// Import default styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider = ({ children }: SolanaProviderProps) => {
  const [network, setNetwork] = useState<Network>('devnet');

  const endpoint = useMemo(() => {
    if (network === 'mainnet-beta') {
      return clusterApiUrl(WalletAdapterNetwork.Mainnet);
    }
    if (network === 'localnet') {
      return 'http://127.0.0.1:8899';
    }
    return clusterApiUrl(WalletAdapterNetwork.Devnet);
  }, [network]);

  const wallets = useMemo(() => [], []);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </NetworkContext.Provider>
  );
};
