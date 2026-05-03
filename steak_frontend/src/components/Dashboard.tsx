import { NavLink, Link } from 'react-router-dom';
import {
  TrendingUp,
  Briefcase,
  BarChart3,
  Beef,
  ChevronDown,
  Globe,
  LogOut,
  RefreshCw,
} from 'lucide-react';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useMemo } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import * as anchor from '@coral-xyz/anchor';
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const DEFAULT_IDRX_MINT = new anchor.web3.PublicKey('9FKKcv9DEX6wq3eC8Y8qESBgqzgTqAdBUtadaft6KzYU');

export const Sidebar = () => {
  const [currentMint] = useState(() => {
    const saved = localStorage.getItem('steak_idrx_mint');
    return saved ? new anchor.web3.PublicKey(saved) : DEFAULT_IDRX_MINT;
  });
  const navItems = [
    { name: 'Earn', icon: TrendingUp, path: '/app/earn' },
    { name: 'My Portfolio', icon: Briefcase, path: '/app/portfolio' },
    { name: 'Analytics', icon: BarChart3, path: '/app/analytics' },
  ];

  const { publicKey, signTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const [isMinting, setIsMinting] = useState(false);

  const handleFaucet = async () => {
    if (!publicKey || !signTransaction) {
      alert('Connect wallet first!');
      return;
    }
    try {
      setIsMinting(true);
      const ata = await getAssociatedTokenAddress(currentMint, publicKey);
      const tx = new anchor.web3.Transaction();

      // Check if ATA exists
      const info = await connection.getAccountInfo(ata);
      if (!info) {
        tx.add(createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, currentMint));
      }

      // MintTo - assuming the user is the authority for this test mint
      // If it fails with 0x4, it means the authority is wrong.
      // For demo, we assume the one who deployed the contract is the authority.
      tx.add(
        createMintToInstruction(
          currentMint,
          ata,
          publicKey,
          1_000_000_000_000, // 1,000,000 IDRX (assuming 6 decimals)
        ),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig);

      alert('Success! 1,000,000 IDRX received.');
    } catch (error) {
      console.error(error);
      alert('Faucet failed: Please ensure you are using the wallet that created the IDRX Mint.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="w-64 h-full bg-grass-card border-r-2 border-black flex flex-col p-6 shadow-[2px_0px_0px_0px_rgba(0,0,0,1)]">
      <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
        <div className="w-10 h-10 bg-grass-primary border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
          <Beef className="text-black w-6 h-6" />
        </div>
        <span className="text-xl font-black tracking-tight text-black">STEAK</span>
      </Link>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-2 ${
                isActive
                  ? 'bg-grass-primary text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-grass-subtext border-transparent hover:bg-grass-primary/10 hover:border-black/20'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-black uppercase text-xs tracking-wider">{item.name}</span>
          </NavLink>
        ))}

        <div className="pt-6 mt-6 border-t-2 border-black">
          <p className="text-[10px] text-grass-subtext uppercase font-black tracking-widest mb-4 px-4">
            Testnet Tools
          </p>
          <button
            onClick={handleFaucet}
            disabled={isMinting}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-black rounded-xl text-black hover:bg-grass-primary transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 group"
          >
            <div
              className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-white border border-black group-hover:rotate-12 transition-transform ${isMinting ? 'animate-spin' : ''}`}
            >
              <img
                src="/idrx_logo.png"
                alt="IDRX"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-black text-xs uppercase tracking-wider">Get Test IDRX</span>
          </button>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t-2 border-black">
        <button
          onClick={() => disconnect()}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 text-white border-2 border-black rounded-xl font-black uppercase text-xs tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          Logout
        </button>
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
    <header className="h-20 border-b-2 border-black flex items-center justify-between px-8 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-grass-subtext font-black uppercase tracking-widest">App</span>
        <span className="text-black font-black">/</span>
        <span className="text-black font-black uppercase tracking-widest bg-grass-primary px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Earn
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Network Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsNetworkOpen(!isNetworkOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl hover:bg-grass-bg transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none h-[42px]"
          >
            <div
              className={`w-2 h-2 rounded-full border border-black ${
                network === 'localnet'
                  ? 'bg-sky-400'
                  : network === 'devnet'
                    ? 'bg-grass-primary'
                    : 'bg-emerald-400'
              }`}
            />
            <span className="text-xs font-black text-black uppercase tracking-wider">
              {network}
            </span>
            <ChevronDown
              size={14}
              className={`text-black transition-transform ${isNetworkOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isNetworkOpen && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 z-50">
              <button
                onClick={() => {
                  setNetwork('localnet');
                  setIsNetworkOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-grass-primary rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 border border-black" />
                  <span className="text-xs font-black text-black uppercase">Localnet</span>
                </div>
                {network === 'localnet' && <Globe size={14} className="text-black" />}
              </button>
              <button
                onClick={() => {
                  setNetwork('devnet');
                  setIsNetworkOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-grass-primary rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-grass-primary border border-black" />
                  <span className="text-xs font-black text-black uppercase">Devnet</span>
                </div>
                {network === 'devnet' && <Globe size={14} className="text-black" />}
              </button>
            </div>
          )}
        </div>

        {/* Custom Wallet Button */}
        <div className="relative">
          {!publicKey ? (
            <button
              onClick={() => setVisible(true)}
              className="px-6 h-[42px] bg-grass-primary text-black border-2 border-black font-black text-xs uppercase tracking-widest rounded-xl hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all whitespace-nowrap"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={() => setIsWalletOpen(!isWalletOpen)}
              className="flex items-center gap-2 px-4 h-[42px] bg-white border-2 border-black rounded-xl hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
            >
              {wallet?.adapter.icon && (
                <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-4 h-4" />
              )}
              <span className="text-xs font-black text-black uppercase tracking-wider">
                {shortAddress}
              </span>
              <ChevronDown
                size={14}
                className={`text-black transition-transform ${isWalletOpen ? 'rotate-180' : ''}`}
              />
            </button>
          )}

          {isWalletOpen && publicKey && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 mb-1 border-b-2 border-black">
                <p className="text-[10px] uppercase tracking-widest text-grass-subtext font-black">
                  Connected Wallet
                </p>
                <p className="text-xs font-black text-black truncate">{publicKey.toBase58()}</p>
              </div>
              <button
                onClick={() => {
                  setVisible(true);
                  setIsWalletOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-grass-primary rounded-lg transition-colors group text-black font-black uppercase text-[10px]"
              >
                <RefreshCw size={14} />
                <span>Change Wallet</span>
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setIsWalletOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-500 rounded-lg transition-colors group text-black font-black uppercase text-[10px]"
              >
                <LogOut size={14} />
                <span>Disconnect</span>
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
      label: 'Total Value Staked',
      value: 'Rp 12,450,200',
      change: '+12.5%',
      color: 'text-emerald-400',
    },
    { label: 'Active Series', value: '4', change: '2 upcoming', color: 'text-amber-500' },
    { label: 'Fixed Rate (Avg)', value: '6.25%', change: 'P.A', color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border-2 border-black p-6 rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <div className="relative z-10">
            <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-1 bg-grass-primary w-fit px-2 border-2 border-black">
              {stat.label}
            </p>
            <div className="flex items-end justify-between mt-4">
              <h3 className="text-2xl font-black text-black">{stat.value}</h3>
              <span
                className={`text-[10px] font-black px-3 py-1 rounded-full border-2 border-black bg-white ${stat.color}`}
              >
                {stat.change}
              </span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-grass-primary/10 rounded-full blur-2xl group-hover:bg-grass-primary/20 transition-colors" />
        </div>
      ))}
    </div>
  );
};

export const PerformanceCard = () => {
  const chartData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        data: [40, 60, 45, 70, 55, 85, 65, 90, 75],
        borderColor: '#000000',
        backgroundColor: 'rgba(181, 255, 0, 0.4)',
        borderWidth: 4,
        tension: 0,
        fill: true,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        hoverRadius: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000000',
        titleFont: { weight: 'bold' },
        cornerRadius: 0,
        displayColors: false,
        callbacks: {
          label: (context) => `Yield: +${((context.parsed.y || 0) / 10).toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
  };

  return (
    <div className="bg-white border-2 border-black p-8 rounded-[32px] mb-10 overflow-hidden relative group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-grass-primary border-2 border-black text-black text-[10px] font-black rounded-full uppercase tracking-widest">
              FIXED RATE RWA
            </span>
            <span className="text-grass-subtext text-[10px] font-black uppercase tracking-widest">
              Performance Index
            </span>
          </div>
          <h2 className="text-3xl font-black mb-6 text-black uppercase tracking-tighter">
            Grafik Imbal Hasil
          </h2>
          <p className="text-grass-subtext font-black text-sm mb-8 leading-relaxed max-w-xl uppercase tracking-tight">
            Imbal hasil Steak Earn Program dihitung setiap hari berdasarkan pertumbuhan nilai aset
            peternakan kambing & domba di Indonesia. Aman, Berkah, & Transparan. 🐐🌿
          </p>
          <div className="flex gap-12">
            <div className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-1">
                Series SS001
              </p>
              <p className="text-2xl font-black text-black">
                6.15% <span className="text-xs text-grass-subtext font-black">p.a</span>
              </p>
            </div>
            <div className="bg-grass-primary border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-black text-[10px] font-black uppercase tracking-widest mb-1">
                Series SS002
              </p>
              <p className="text-2xl font-black text-black">
                6.40% <span className="text-xs text-black/60 font-black">p.a</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-80 h-48 bg-white border-2 border-black rounded-[24px] p-4 flex items-center justify-center">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

interface SukukCardProps {
  id: string;
  name: string;
  duration: number;
  roi: string;
  quota: number;
  maxQuota: number;
  onStake?: (amount: number) => void;
  isProcessing?: boolean;
}

export const SukukCard = ({
  name,
  duration,
  roi,
  quota,
  maxQuota,
  onStake,
  isProcessing,
}: SukukCardProps) => {
  const [stakeAmount, setStakeAmount] = useState<string>('1000000');
  const percentage = Math.min(100, (quota / maxQuota) * 100);
  const badgeColors: Record<number, string> = {
    30: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    60: 'bg-grass-primary/10 text-grass-dark border-grass-primary/20',
    90: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  return (
    <div className="group bg-white border-2 border-black p-8 rounded-[32px] transition-all duration-200 flex flex-col gap-8 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <span
            className={`text-[10px] uppercase font-black px-4 py-2 rounded-full border-2 border-black ${badgeColors[duration] || badgeColors[30]}`}
          >
            {duration} HARI LOCK
          </span>
          <h4 className="text-2xl font-black mt-6 text-black uppercase tracking-tighter">{name}</h4>
        </div>
        <div className="text-right">
          <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest">
            Fixed Rate
          </p>
          <div className="bg-grass-primary border-2 border-black px-4 py-1 mt-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black text-black">{roi}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-grass-subtext">Terisi</span>
            <span className="text-black">
              {quota.toLocaleString()} / {maxQuota.toLocaleString()} IDRX
            </span>
          </div>
          <div className="h-6 w-full bg-white border-2 border-black rounded-full overflow-hidden p-[2px] shadow-inner">
            <div
              className="h-full bg-grass-primary border-r-2 border-black transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-grass-subtext font-black uppercase">
              {percentage.toFixed(1)}% Terisi
            </p>
            <span className="text-[10px] font-black px-2 bg-black text-white uppercase">
              Series Active
            </span>
          </div>
        </div>

        <div className="relative">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="w-full bg-white border-2 border-black rounded-2xl py-5 px-6 text-black font-black focus:outline-none focus:bg-grass-primary/5 transition-all text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            placeholder="Nominal"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-black font-black text-sm">
            IDRX
          </div>
        </div>
      </div>

      <button
        disabled={isProcessing || percentage >= 100 || !stakeAmount}
        onClick={() => onStake?.(Number(stakeAmount))}
        className={`w-full py-6 rounded-2xl font-black transition-all duration-200 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-3 text-xl uppercase tracking-widest border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
          percentage >= 100
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none translate-y-0'
            : 'bg-grass-primary text-black hover:bg-emerald-400'
        }`}
      >
        {isProcessing ? (
          <RefreshCw size={24} className="animate-spin" />
        ) : percentage >= 100 ? (
          'QUOTA FULL'
        ) : (
          'INVESTASI'
        )}
      </button>

      <div className="pt-4 border-t-2 border-black flex items-center gap-2 text-[10px] text-grass-subtext font-black uppercase tracking-widest">
        <div className="w-2 h-2 rounded-full bg-black animate-pulse border border-black" />
        Asset Dasar: Kambing & Domba 🐐
      </div>
    </div>
  );
};
