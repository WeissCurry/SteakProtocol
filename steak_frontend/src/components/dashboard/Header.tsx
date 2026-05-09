import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Globe,
  LogOut,
  RefreshCw,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useNetwork } from '../../contexts/NetworkContext';
import * as anchor from '@coral-xyz/anchor';
import { WalletSelectionModal } from '../WalletSelectionModal';

const DEFAULT_IDRX_MINT = new anchor.web3.PublicKey('CHyZcyVYWNpXDxHtuLEZyw7xwyPCkj9G8DzLj3gvtsPx');

export const Header = () => {
  const { network, setNetwork } = useNetwork();
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const { publicKey, disconnect, wallet } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || 'Earn';

  const shortAddress = useMemo(() => {
    if (!publicKey) return '';
    const base58 = publicKey.toBase58();
    return `${base58.slice(0, 4)}..${base58.slice(-4)}`;
  }, [publicKey]);

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [idrxBalance, setIdrxBalance] = useState<number | null>(null);
  const { connection } = useConnection();

  const [currentMint] = useState(() => {
    const saved = localStorage.getItem('steak_idrx_mint');
    return saved ? new anchor.web3.PublicKey(saved) : DEFAULT_IDRX_MINT;
  });

  useEffect(() => {
    const fetchBalances = async () => {
      if (!publicKey) {
        setSolBalance(null);
        setIdrxBalance(null);
        return;
      }
      try {
        const sol = await connection.getBalance(publicKey);
        setSolBalance(sol / anchor.web3.LAMPORTS_PER_SOL);

        const { getAssociatedTokenAddress, getAccount } = await import('@solana/spl-token');
        const ata = await getAssociatedTokenAddress(currentMint, publicKey);
        try {
          const account = await getAccount(connection, ata);
          setIdrxBalance(Number(account.amount) / 10 ** 9);
        } catch {
          setIdrxBalance(0);
        }
      } catch (err) {
        console.error('Failed to fetch balances:', err);
      }
    };

    fetchBalances();
    const id = setInterval(fetchBalances, 10000);
    return () => clearInterval(id);
  }, [publicKey, connection, currentMint]);

  const getPageTitle = (path: string) => {
    switch (path.toLowerCase()) {
      case 'earn':
        return 'Earn';
      case 'portfolio':
        return 'My Portfolio';
      case 'analytics':
        return 'Analytics';
      default:
        return 'Earn';
    }
  };

  return (
    <>
      <header className="h-20 border-b-2 border-black flex items-center justify-between px-8 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2 text-[9px]">
          <span className="text-grass-subtext font-black uppercase tracking-widest">
            {pathParts[0] || 'App'}
          </span>
          <span className="text-black font-black">/</span>
          <span className="text-black font-black uppercase tracking-widest bg-grass-primary px-2 py-0.5 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {getPageTitle(currentPage)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Network Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsNetworkOpen(!isNetworkOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black rounded-lg hover:bg-grass-bg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none h-9"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full border border-black ${
                  network === 'localnet'
                    ? 'bg-sky-400'
                    : network === 'devnet'
                      ? 'bg-grass-primary'
                      : 'bg-emerald-400'
                }`}
              />
              <span className="text-[9px] font-black text-black uppercase tracking-wider">
                {network}
              </span>
              <ChevronDown
                size={12}
                className={`text-black transition-transform ${isNetworkOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isNetworkOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 z-50">
                <button
                  onClick={() => {
                    setNetwork('localnet');
                    setIsNetworkOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-grass-primary rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 border border-black" />
                    <span className="text-[9px] font-black text-black uppercase">Localnet</span>
                  </div>
                  {network === 'localnet' && <Globe size={12} className="text-black" />}
                </button>
                <button
                  onClick={() => {
                    setNetwork('devnet');
                    setIsNetworkOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-grass-primary rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-grass-primary border border-black" />
                    <span className="text-[9px] font-black text-black uppercase">Devnet</span>
                  </div>
                  {network === 'devnet' && <Globe size={12} className="text-black" />}
                </button>
              </div>
            )}
          </div>

          {/* Balances Display */}
          {publicKey && (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-sky-400 rotate-45" />
                </div>
                <span className="text-[9px] font-black text-black">
                  {solBalance !== null ? solBalance.toFixed(2) : '...'} SOL
                </span>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-grass-primary border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-4 h-4 rounded-full overflow-hidden border border-black/20">
                  <img src="/idrx_logo.png" alt="IDRX" className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-black text-black">
                  {idrxBalance !== null ? idrxBalance.toLocaleString('id-ID') : '...'} IDRX
                </span>
              </div>
            </div>
          )}

          {/* Custom Wallet Button */}
          <div className="relative">
            {!publicKey ? (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-4 h-9 bg-grass-primary text-black border-2 border-black font-black text-[9px] uppercase tracking-widest rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all whitespace-nowrap flex items-center gap-2"
              >
                <WalletIcon size={14} />
                Connect
              </button>
            ) : (
              <button
                onClick={() => setIsWalletOpen(!isWalletOpen)}
                className="flex items-center gap-2 px-3 h-9 bg-white border-2 border-black rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group"
              >
                {wallet?.adapter.icon && (
                  <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-3.5 h-3.5" />
                )}
                <span className="text-[9px] font-black text-black uppercase tracking-wider">
                  {shortAddress}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-black transition-transform ${isWalletOpen ? 'rotate-180' : ''}`}
                />
              </button>
            )}

            {isWalletOpen && publicKey && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="px-3 py-2 mb-1 border-b-2 border-black">
                  <p className="text-[8px] uppercase tracking-widest text-grass-subtext font-black">
                    Wallet
                  </p>
                  <p className="text-[10px] font-black text-black truncate">{publicKey.toBase58()}</p>
                </div>
                <button
                  onClick={() => {
                    setIsWalletModalOpen(true);
                    setIsWalletOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-grass-primary rounded-lg transition-colors group text-black font-black uppercase text-[9px]"
                >
                  <RefreshCw size={12} />
                  <span>Change</span>
                </button>
                <button
                  onClick={() => {
                    disconnect();
                    setIsWalletOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors group text-black font-black uppercase text-[9px]"
                >
                  <LogOut size={12} />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <WalletSelectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
};
