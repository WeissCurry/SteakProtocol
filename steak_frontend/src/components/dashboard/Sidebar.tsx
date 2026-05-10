import { NavLink, Link } from 'react-router-dom';
import { TrendingUp, Briefcase, BarChart3, ShieldCheck, LogOut } from 'lucide-react';
import { useSteakProgram } from '../../hooks/useSteakProgram';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import * as anchor from '@coral-xyz/anchor';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import NotificationModal from '../NotificationModal';

const DEFAULT_IDRX_MINT = new anchor.web3.PublicKey('CHyZcyVYWNpXDxHtuLEZyw7xwyPCkj9G8DzLj3gvtsPx');

export const Sidebar = () => {
  const [currentMint] = useState(() => {
    const saved = localStorage.getItem('steak_idrx_mint');
    return saved ? new anchor.web3.PublicKey(saved) : DEFAULT_IDRX_MINT;
  });
  const navItems = [
    { name: 'Earn', icon: TrendingUp, path: '/app/earn' },
    { name: 'Portfolio', icon: Briefcase, path: '/app/portfolio' },
    { name: 'Analytics', icon: BarChart3, path: '/app/analytics' },
  ];

  const { publicKey, signTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const program = useSteakProgram();
  const [isMinting, setIsMinting] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'error' | 'success',
  });

  const handleFaucet = async () => {
    if (!publicKey || !signTransaction) {
      setNotification({
        isOpen: true,
        title: 'Wallet Required',
        message: 'Connect wallet to receive test IDRX.',
        type: 'error',
      });
      return;
    }
    try {
      setIsMinting(true);
      const ata = await getAssociatedTokenAddress(currentMint, publicKey);

      const [mintAuthorityPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('mint_authority')],
        program.programId,
      );

      const info = await connection.getAccountInfo(ata);
      const preInstructions = [];
      if (!info) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, currentMint),
        );
      }

      await program.methods
        .faucet(new anchor.BN(1_000_000).mul(new anchor.BN(10).pow(new anchor.BN(9))))
        .accounts({
          mint: currentMint,
          userAta: ata,
          mintAuthority: mintAuthorityPda,
          user: publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .preInstructions(preInstructions)
        .rpc();

      setNotification({
        isOpen: true,
        title: 'Tokens Received!',
        message: '1,000,000 IDRX minted. 🚀',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      const err = error as { message?: string; logs?: string[] };
      let errorMsg =
        error instanceof Error ? error.message : 'Check if you are the Mint Authority.';

      if (
        err?.logs?.some(
          (log: string) => log.includes('0x4') || log.includes('owner does not match'),
        )
      ) {
        errorMsg = 'NOT MINT AUTHORITY. Only the creator can mint. 🛡️';
      }

      setNotification({
        isOpen: true,
        title: 'Faucet Restriction',
        message: errorMsg,
        type: 'error',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="w-56 h-full bg-grass-card border-r-2 border-black flex flex-col p-5 shadow-[2px_0px_0px_0px_rgba(0,0,0,1)]">
      <Link to="/" className="flex items-center gap-3 mb-8 px-2 group">
        <img
          src="/SteakProtocolLogo.png"
          alt="Logo"
          className="w-full h-auto object-contain group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-all"
        />
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border-2 ${
                isActive
                  ? 'bg-grass-primary text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-grass-subtext border-transparent hover:bg-grass-primary/10 hover:border-black/20'
              }`
            }
          >
            <item.icon size={16} />
            <span className="font-black uppercase text-[9px] tracking-widest">{item.name}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t-2 border-black">
          <p className="text-[8px] text-grass-subtext uppercase font-black tracking-widest mb-3 px-3">
            Tools
          </p>
          <div className="space-y-2">
            <button
              onClick={handleFaucet}
              disabled={isMinting}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-white border-2 border-black rounded-lg text-black hover:bg-grass-primary transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50 group"
            >
              <div
                className={`w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white border border-black group-hover:rotate-12 transition-transform ${isMinting ? 'animate-spin' : ''}`}
              >
                <img
                  src="/idrx_logo.png"
                  alt="IDRX"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-black text-[9px] uppercase tracking-widest">Faucet</span>
            </button>

            <NavLink
              to="/app/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border-2 ${
                  isActive
                    ? 'bg-black text-grass-primary border-black shadow-[2px_2px_0px_0px_rgba(181,255,0,1)]'
                    : 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all'
                }`
              }
            >
              <ShieldCheck size={16} />
              <span className="font-black uppercase text-[9px] tracking-widest">Admin</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t-2 border-black">
        <button
          onClick={() => disconnect()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500 text-white border-2 border-black rounded-lg font-black uppercase text-[9px] tracking-widest hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};
