import { StatsRow, SukukCard, PerformanceCard } from '../components/Dashboard';
import { useSteakProgram } from '../hooks/useSteakProgram';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { useState } from 'react';
import { useBatches } from '../hooks/useBatches';
import { BatchAccount, ProgramAccount } from '../types/steak';
import {
  getBatchAddress,
  getBatchVaultAddress,
  getUserStakeAddress,
  getGlobalStateAddress,
} from '../utils/pda';
import { getOrCreateAssociatedTokenAccount } from '../utils/tokens';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { RefreshCw, Plus, X, Download, Share2, CheckCircle2, Settings, Wrench } from 'lucide-react';
import { CreateSeriesModal } from '../components/CreateSeriesModal';
import {
  MINT_SIZE,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
} from '@solana/spl-token';

const DEFAULT_IDRX_MINT = new anchor.web3.PublicKey('9FKKcv9DEX6wq3eC8Y8qESBgqzgTqAdBUtadaft6KzYU');

const VaultsPage = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const program = useSteakProgram();
  const { data: batches, isLoading, refetch } = useBatches();
  const [isDeploying, setIsDeploying] = useState(false);
  const [showNftModal, setShowNftModal] = useState(false);
  const [lastStakeInfo, setLastStakeInfo] = useState<{
    amount: number;
    duration: number;
    apy: string;
  } | null>(null);
  const [certificateId, setCertificateId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  // Use custom mint from localStorage if available
  const [currentMint, setCurrentMint] = useState(() => {
    const saved = localStorage.getItem('steak_idrx_mint');
    return saved ? new anchor.web3.PublicKey(saved) : DEFAULT_IDRX_MINT;
  });

  const handleStake = async (batchId: number, amount: number, duration: number, apy: string) => {
    if (!publicKey || !signTransaction || !program) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setIsDeploying(true);
      const stakeAmount = new anchor.BN(amount).mul(new anchor.BN(10).pow(new anchor.BN(6)));
      const batchIdBN = new anchor.BN(batchId);

      const batch = getBatchAddress(batchId, program.programId);
      const batchVault = getBatchVaultAddress(batchId, program.programId);
      const userStake = getUserStakeAddress(publicKey, batchId, program.programId);
      const globalState = getGlobalStateAddress(program.programId);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        currentMint,
        publicKey,
        signTransaction,
      );

      await program.methods
        .stake(batchIdBN, stakeAmount)
        .accounts({
          batch,
          batchVault,
          userStake,
          globalState,
          userTokenAccount,
          user: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      setLastStakeInfo({ amount, duration, apy });
      setCertificateId((Math.random() * 1000).toFixed(0));
      setShowNftModal(true);

      // Save Activity to LocalStorage
      const newActivity = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'STAKE',
        amount: amount,
        series: `SS00${batchId}`,
        date: new Date().toISOString(),
        duration,
        apy,
        status: 'SUCCESS',
      };
      const existingActivities = JSON.parse(localStorage.getItem('steak_activities') || '[]');
      localStorage.setItem(
        'steak_activities',
        JSON.stringify([newActivity, ...existingActivities]),
      );

      refetch();
    } catch (error) {
      console.error('Stake failed:', error);
      alert('Stake failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCreateSeries = async (days: number, capacity: number, apyBps: number) => {
    if (!publicKey || !program) return;
    try {
      setIsDeploying(true);
      const nextId = (batches?.length || 0) + 1;
      const batchId = new anchor.BN(nextId);
      const duration = new anchor.BN(days * 24 * 60 * 60);
      const maxCapacity = new anchor.BN(capacity).mul(new anchor.BN(10).pow(new anchor.BN(6)));
      const apy = new anchor.BN(apyBps);

      const batch = getBatchAddress(nextId, program.programId);
      const batchVault = getBatchVaultAddress(nextId, program.programId);

      await program.methods
        .createBatch(batchId, duration, maxCapacity, apy)
        .accounts({
          batch,
          batchVault,
          usdcMint: currentMint,
          admin: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      alert(`Staking Series SS00${nextId} Berhasil Diaktifkan!`);
      setShowCreateModal(false);
      refetch();
    } catch (error) {
      alert('Gagal membuat seri: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSetupAll = async () => {
    if (!publicKey || !program || !signTransaction) return;
    try {
      setIsDeploying(true);

      // 1. Initialize Protocol
      const globalState = getGlobalStateAddress(program.programId);
      try {
        await program.methods
          .initializeProtocol()
          .accounts({
            globalState,
            admin: publicKey,
            feeDestination: publicKey,
          })
          .rpc();
        console.log('Protocol Initialized');
      } catch {
        console.log('Protocol already initialized or failed, continuing...');
      }

      // 2. Create New IDRX Mint (Custom for this admin)
      const mintKeypair = anchor.web3.Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const setupTx = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          6,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID,
        ),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      setupTx.recentBlockhash = blockhash;
      setupTx.feePayer = publicKey;
      setupTx.partialSign(mintKeypair);

      const signed = await signTransaction(setupTx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig);

      const mint = mintKeypair.publicKey;
      localStorage.setItem('steak_idrx_mint', mint.toBase58());
      setCurrentMint(mint);

      alert('Setup Berhasil! Protocol Aktif & Mint IDRX Baru telah dibuat.');
    } catch (error) {
      console.error(error);
      alert('Setup Gagal: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleInitialize = async () => {
    if (!publicKey || !program) return;
    try {
      setIsDeploying(true);
      const globalState = getGlobalStateAddress(program.programId);
      await program.methods
        .initializeProtocol()
        .accounts({
          globalState,
          admin: publicKey,
          feeDestination: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      alert('Protocol Initialized!');
    } catch (error) {
      alert('Note: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsDeploying(false);
    }
  };

  const [filter, setFilter] = useState<'All' | 'Active' | 'Upcoming' | 'Finished'>('All');
  const [now] = useState(() => Math.floor(Date.now() / 1000));

  const filteredBatches = (batches || []).filter((b: ProgramAccount<BatchAccount>) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return b.account.isActive && !b.account.isHarvested;
    if (filter === 'Finished') return b.account.isHarvested;
    if (filter === 'Upcoming') {
      return b.account.startTime.toNumber() > now;
    }
    return true;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-6xl font-black text-black uppercase tracking-tighter leading-none">
              Steak <br />
              <span className="text-white bg-black px-4 shadow-[6px_6px_0px_0px_rgba(181,255,0,1)]">
                Earn
              </span>
            </h1>
            <span className="text-4xl animate-bounce">🐐</span>
          </div>
          <p className="text-grass-subtext max-w-2xl font-black text-sm uppercase tracking-tight leading-tight">
            Investasikan aset Anda pada <b>Earn Program</b>. Dapatkan imbal hasil harian dari
            pengelolaan aset riil peternakan kambing & domba di Indonesia. 🌿🌿🌿
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-black bg-grass-primary w-fit px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest">
            <Settings size={14} />
            IDRX MINT: {currentMint.toBase58().slice(0, 8)}...{currentMint.toBase58().slice(-8)}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-black text-xs font-black rounded-xl hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black uppercase tracking-widest"
          >
            <Wrench size={16} className="text-blue-600" />
            ADMIN TOOLS
          </button>

          <button
            disabled={isDeploying}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-grass-primary text-black border-2 border-black text-xs font-black rounded-xl hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            <Plus size={16} />
            {isDeploying ? '...' : 'BUKA SERI BARU'}
          </button>
        </div>
      </div>

      {/* Admin Quick Setup Panel */}
      {showSetup && (
        <div className="mb-10 p-10 bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-2xl font-black text-black uppercase tracking-tighter flex items-center gap-3">
              <Wrench size={24} className="text-blue-600" />
              Quick Setup (Admin Only)
            </h4>
            <button
              onClick={() => setShowSetup(false)}
              className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-black font-black uppercase tracking-tight mb-10 max-w-xl leading-snug">
            Gunakan fitur ini jika protokol belum aktif atau jika Faucet IDRX kamu gagal. Fitur ini
            akan menginisialisasi kontrak dan membuat Mint IDRX baru dimana kamu adalah pemiliknya.
            🛠️
          </p>
          <div className="flex flex-wrap gap-6">
            <button
              onClick={handleInitialize}
              className="px-10 py-5 bg-white border-2 border-black text-black rounded-none text-xs font-black hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-widest"
            >
              1. Initialize Protocol (INIT)
            </button>
            <button
              onClick={handleSetupAll}
              className="px-10 py-5 bg-blue-600 text-white border-2 border-black rounded-none text-xs font-black hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-widest"
            >
              2. Create Personal IDRX Mint & Setup
            </button>
          </div>
        </div>
      )}

      <StatsRow />

      <PerformanceCard />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b-4 border-black pb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Staking Pools</h2>
          {isLoading && <RefreshCw size={20} className="animate-spin text-grass-subtext" />}
        </div>
        <div className="flex gap-2">
          {(['All', 'Active', 'Upcoming', 'Finished'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 border-2 border-black text-[10px] font-black uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                filter === f ? 'bg-grass-primary text-black' : 'bg-white text-grass-subtext'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {filteredBatches && filteredBatches.length > 0 ? (
          filteredBatches.map((b: ProgramAccount<BatchAccount>) => (
            <SukukCard
              key={b.publicKey.toBase58()}
              id={b.account.batchId.toString()}
              name={`Steak Series SS00${b.account.batchId.toString()}`}
              duration={Number(b.account.lockDuration) / (24 * 60 * 60)}
              roi={`${(Number(b.account.apy || 615) / 100).toFixed(2)}%`}
              quota={Number(b.account.totalStaked) / 1_000_000}
              maxQuota={Number(b.account.maxCapacity || 5_000_000_000_000) / 1_000_000}
              onStake={(amount) =>
                handleStake(
                  Number(b.account.batchId),
                  amount,
                  Number(b.account.lockDuration) / (24 * 60 * 60),
                  `${(Number(b.account.apy || 615) / 100).toFixed(2)}%`,
                )
              }
              isProcessing={isDeploying}
            />
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border-4 border-dashed border-black rounded-[40px] bg-white/50">
            <div className="w-20 h-20 bg-grass-bg border-2 border-black rounded-3xl flex items-center justify-center mb-6 text-grass-subtext shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <RefreshCw size={40} />
            </div>
            <p className="text-black font-black uppercase tracking-widest text-lg">
              No {filter !== 'All' ? filter : ''} staking series found.
            </p>
            <p className="text-grass-subtext text-xs mt-2 font-black uppercase">
              Admin can click "BUKA SERI BARU" to start a new program.
            </p>
          </div>
        )}
      </div>

      {/* NFT Receipt Modal */}
      {showNftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowNftModal(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-2">Pemesanan Berhasil!</h3>
              <p className="text-zinc-400 text-sm mb-10">
                Anda telah resmi memiliki Sukuk Steak. NFT Kepemilikan telah dikirim ke wallet Anda.
              </p>

              {/* NFT Visualized Card */}
              <div className="bg-zinc-950 rounded-3xl p-6 border border-zinc-800 mb-10 text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Plus size={100} />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div className="px-2 py-1 bg-amber-500 text-zinc-950 text-[8px] font-black rounded uppercase">
                    Official Staking Certificate
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">#SS-{certificateId}</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      Asset Name
                    </p>
                    <p className="text-lg font-bold">Steak Staking Series SS001</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                        Amount
                      </p>
                      <p className="text-emerald-400 font-bold">
                        {lastStakeInfo?.amount.toLocaleString()} IDRX
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                        Fixed Rate
                      </p>
                      <p className="text-amber-500 font-bold">{lastStakeInfo?.apy}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      Tenor
                    </p>
                    <p className="text-zinc-200 font-medium">
                      {lastStakeInfo?.duration} Hari (Locked)
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                  <p className="text-[8px] text-zinc-600 font-mono">
                    VERIFIED ON SOLANA BLOCKCHAIN
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all">
                  <Download size={16} />
                  Simpan
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-2xl transition-all">
                  <Share2 size={16} />
                  Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <CreateSeriesModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSeries}
        isProcessing={isDeploying}
      />
    </>
  );
};

export default VaultsPage;
