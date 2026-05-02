import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Beef,
  ChevronDown,
  Globe,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useMemo } from 'react';
import { useNetwork } from '../contexts/NetworkContext';

export const Sidebar = () => {
  const navItems = [
    { name: 'Vaults', icon: LayoutDashboard, path: '/app/vaults' },
    { name: 'My Portfolio', icon: Briefcase, path: '/app/portfolio' },
    { name: 'Analytics', icon: BarChart3, path: '/app/analytics' },
  ];

  return (
    <div className="w-64 h-full bg-zinc-900/50 border-r border-zinc-800 flex flex-col p-6">
      <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
          <Beef className="text-zinc-950 w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight">STEAK</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
        <p className="text-xs text-zinc-500 uppercase font-semibold mb-2">Protocol Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-zinc-300">Mainnet Live</span>
        </div>
      </div>
    </div>
  );
};

export const Header = () => {
  const { network, setNetwork } = useNetwork();
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const { publicKey, disconnect, wallet } = useWallet();
  const { setVisible } = useWalletModal();

  const shortAddress = useMemo(() => {
    if (!publicKey) return '';
    const base58 = publicKey.toBase58();
    return `${base58.slice(0, 4)}..${base58.slice(-4)}`;
  }, [publicKey]);

  return (
    <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500">App</span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-200 font-medium">Vaults</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Network Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsNetworkOpen(!isNetworkOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors group h-[42px]"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                network === 'localnet'
                  ? 'bg-sky-500'
                  : network === 'devnet'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              }`}
            />
            <span className="text-sm font-bold capitalize">{network}</span>
            <ChevronDown
              size={14}
              className={`text-zinc-500 transition-transform ${isNetworkOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isNetworkOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 z-50">
              <button
                onClick={() => {
                  setNetwork('localnet');
                  setIsNetworkOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
                    Localnet
                  </span>
                </div>
                {network === 'localnet' && <Globe size={14} className="text-sky-500" />}
              </button>
              <button
                onClick={() => {
                  setNetwork('devnet');
                  setIsNetworkOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
                    Devnet
                  </span>
                </div>
                {network === 'devnet' && <Globe size={14} className="text-amber-500" />}
              </button>
              <button
                onClick={() => {
                  setNetwork('mainnet-beta');
                  setIsNetworkOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
                    Mainnet
                  </span>
                </div>
                {network === 'mainnet-beta' && <Globe size={14} className="text-emerald-500" />}
              </button>
            </div>
          )}
        </div>

        {/* Custom Wallet Button */}
        <div className="relative">
          {!publicKey ? (
            <button
              onClick={() => setVisible(true)}
              className="px-6 h-[42px] bg-amber-500 text-zinc-950 font-black text-sm rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={() => setIsWalletOpen(!isWalletOpen)}
              className="flex items-center gap-2 px-4 h-[42px] bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors group"
            >
              {wallet?.adapter.icon && (
                <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-4 h-4" />
              )}
              <span className="text-sm font-bold text-zinc-200">{shortAddress}</span>
              <ChevronDown
                size={14}
                className={`text-zinc-500 transition-transform ${isWalletOpen ? 'rotate-180' : ''}`}
              />
            </button>
          )}

          {isWalletOpen && publicKey && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 mb-1 border-b border-zinc-800">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                  Connected Wallet
                </p>
                <p className="text-sm font-medium text-zinc-200 truncate">{publicKey.toBase58()}</p>
              </div>
              <button
                onClick={() => {
                  setVisible(true);
                  setIsWalletOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-800 rounded-lg transition-colors group text-zinc-400 hover:text-white"
              >
                <RefreshCw size={14} />
                <span className="text-sm font-medium">Change Wallet</span>
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setIsWalletOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-500/10 rounded-lg transition-colors group text-zinc-400 hover:text-red-400"
              >
                <LogOut size={14} />
                <span className="text-sm font-medium">Disconnect</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export const StatsRow = () => {
  const stats = [
    {
      label: 'Total Value Locked',
      value: '$12,450,200',
      change: '+12.5%',
      color: 'text-emerald-400',
    },
    { label: 'Active Batches', value: '24', change: '8 pending', color: 'text-amber-500' },
    { label: 'Avg. Est. Yield', value: '42.8%', change: 'Real Yield', color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm"
        >
          <p className="text-zinc-500 text-sm font-medium mb-1">{stat.label}</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-zinc-800 ${stat.color}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

interface VaultCardProps {
  id: string;
  name: string;
  duration: number;
  roi: string;
  type: string;
  onStake?: () => void;
  isProcessing?: boolean;
}

export const VaultCard = ({
  name,
  duration,
  roi,
  type,
  onStake,
  isProcessing,
}: VaultCardProps) => {
  const badgeColors: Record<number, string> = {
    30: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    60: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    90: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 p-6 rounded-3xl transition-all duration-300 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Beef size={80} />
      </div>

      <div className="flex justify-between items-start">
        <div>
          <span
            className={`text-[10px] uppercase font-black px-2 py-1 rounded-md border ${badgeColors[duration] || badgeColors[30]}`}
          >
            {duration} DAYS LOCK
          </span>
          <h4 className="text-xl font-bold mt-3 group-hover:text-amber-400 transition-colors">
            {name}
          </h4>
          <p className="text-zinc-500 text-sm mt-1">Livestock: {type}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Estimated ROI</p>
        <p className="text-3xl font-black text-emerald-400">{roi}</p>
      </div>

      <button
        disabled={isProcessing}
        onClick={onStake}
        className="w-full py-4 bg-zinc-800 group-hover:bg-amber-500 text-white group-hover:text-zinc-950 font-bold rounded-2xl transition-all duration-300 disabled:opacity-50"
      >
        {isProcessing ? 'PROCESSING...' : 'STAKE 1M IDRX'}
      </button>
    </div>
  );
};
