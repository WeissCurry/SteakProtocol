import { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';

import { useBatches } from '../hooks/useBatches';
import { useSteakProgram } from '../hooks/useSteakProgram';
import * as anchor from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import NotificationModal from '../components/NotificationModal';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminBatchCard } from '../components/admin/AdminBatchCard';
import { CreateSeriesModal } from '../components/admin/CreateSeriesModal';

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Notification State
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const showSuccess = (title: string, message: string) => {
    setNotification({ isOpen: true, title, message, type: 'success' });
  };

  const showError = (title: string, message: string) => {
    setNotification({ isOpen: true, title, message, type: 'error' });
  };

  const { data: blockchainBatches, refetch } = useBatches();
  const program = useSteakProgram();
  const { publicKey } = useWallet();

  const [formData, setFormData] = useState({
    name: 'SS001',
    duration: 30,
    quota: 1000000,
    goats: 0,
    cows: 0,
    profit: 50000,
    openStart: new Date().toISOString().split('T')[0],
    openEnd: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    stakingStart: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
  });

  const stakingEnd = useMemo(() => {
    const start = new Date(formData.stakingStart);
    start.setDate(start.getDate() + formData.duration);
    return start.toISOString().split('T')[0];
  }, [formData.stakingStart, formData.duration]);

  const batches = useMemo(() => {
    if (!blockchainBatches) return [];
    return blockchainBatches.map((b) => ({
      id: `SS${String(b.account.batchId).padStart(3, '0')}`,
      batchId: Number(b.account.batchId),
      totalStaked: Number(b.account.totalStaked) / 10 ** 9,
      maxCapacity: Number(b.account.maxCapacity) / 10 ** 9,
      lockDuration: Number(b.account.lockDuration),
      apy: (Number(b.account.apy) / 100).toFixed(2) + '%',
      isActive: b.account.isActive,
      isHarvested: b.account.isHarvested,
      goats: Number(b.account.goats),
      cows: Number(b.account.cows),
      name: b.account.name,
      estimatedProfit: (((Number(b.account.maxCapacity) / 10 ** 9) * Number(b.account.apy)) / 10000) * (Number(b.account.lockDuration) / 365),
      startTime: b.account.startTime ? Number(b.account.startTime) : null,
      publicKey: b.publicKey,
    })).sort((a, b) => b.batchId - a.batchId);
  }, [blockchainBatches]);

  const adminStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const profitThisMonth = batches
      .filter(b => {
        if (!b.startTime) return false;
        const d = new Date(b.startTime * 1000);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, b) => sum + b.estimatedProfit, 0);

    const pendingDeposits = batches
      .filter(b => b.isActive && !b.isHarvested)
      .reduce((sum, b) => sum + (b.maxCapacity + b.estimatedProfit), 0);

    const countLast3Months = batches.filter(b => {
      if (!b.startTime) return true;
      return new Date(b.startTime * 1000) >= threeMonthsAgo;
    }).length;

    return { profitThisMonth, pendingDeposits, countLast3Months };
  }, [batches]);

  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInit = async () => {
      if (!program) return;
      try {
        const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('global_state')], program.programId);
        // @ts-ignore - Handle possible naming mismatch in IDL
        const account = await program.account.globalState?.fetch(globalStatePda) || await (program.account as any).global_state?.fetch(globalStatePda);
        setIsInitialized(!!account);
      } catch (e) {
        setIsInitialized(false);
      }
    };
    checkInit();
  }, [program, blockchainBatches]);

  useEffect(() => {
    if (batches && batches.length >= 0) {
      const maxId = batches.reduce((max, b) => Math.max(max, b.batchId), 0);
      const nextId = maxId + 1;
      setFormData(prev => ({
        ...prev,
        name: `SS${String(nextId).padStart(3, '0')}`
      }));
    }
  }, [batches]);

  const calculatedApy = useMemo(() => {
    if (!formData.profit || !formData.quota || !formData.duration) return '0';
    const apy = (formData.profit / formData.quota) * (365 / formData.duration) * 100;
    return apy.toFixed(2);
  }, [formData.profit, formData.quota, formData.duration]);

  const handleInitializeProtocol = async () => {
    if (!program || !publicKey) return;
    try {
      setIsLoading(true);
      const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('global_state')], program.programId);
      
      await program.methods
        .initializeProtocol()
        .accounts({
          globalState: globalStatePda,
          admin: publicKey,
          feeDestination: publicKey, // Default to admin for now
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      await refetch();
      showSuccess('Protocol Initialized!', 'Global state created. You can now manage series. 🏛️');
    } catch (error) {
      console.error(error);
      showError('Initialization Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!program || !publicKey) return;
    try {
      setIsLoading(true);
      let currentId = batches.length + 1;
      let isAvailable = false;
      let batchPda: anchor.web3.PublicKey = anchor.web3.PublicKey.default;

      while (!isAvailable) {
        const batchIdBn = new anchor.BN(currentId);
        [batchPda] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from('batch'), batchIdBn.toArrayLike(Buffer, 'le', 8)],
          program.programId,
        );
        const accountInfo = await program.provider.connection.getAccountInfo(batchPda);
        if (!accountInfo) isAvailable = true;
        else currentId++;
      }

      const batchId = new anchor.BN(currentId);
      const apyBP = new anchor.BN(Math.floor(Number(calculatedApy) * 100));
      const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('global_state')], program.programId);
      const IDRX_MINT = new anchor.web3.PublicKey('CHyZcyVYWNpXDxHtuLEZyw7xwyPCkj9G8DzLj3gvtsPx');
      const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('batch_vault'), batchId.toArrayLike(Buffer, 'le', 8)],
        program.programId,
      );

      await program.methods
        .createBatch(
          batchId,
          new anchor.BN(formData.duration),
          new anchor.BN(formData.quota).mul(new anchor.BN(10).pow(new anchor.BN(9))),
          apyBP,
          new anchor.BN(formData.goats),
          new anchor.BN(formData.cows),
          formData.name
        )
        .accounts({
          batch: batchPda,
          batchVault: vaultPda,
          tokenMint: IDRX_MINT,
          admin: publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      await refetch();
      setShowCreateModal(false);
      showSuccess('Series Created!', `Batch ${currentId} ("${formData.name}") has been successfully deployed. 🐮🌿`);
    } catch (error) {
      console.error(error);
      showError('Deployment Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBatch = async (batchId: number, batchPda: anchor.web3.PublicKey) => {
    if (!program || !publicKey) return;
    try {
      setIsLoading(true);
      const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('global_state')], program.programId);
      const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('batch_vault'), new anchor.BN(batchId).toArrayLike(Buffer, 'le', 8)], program.programId);
      const IDRX_MINT = new anchor.web3.PublicKey('CHyZcyVYWNpXDxHtuLEZyw7xwyPCkj9G8DzLj3gvtsPx');
      const { getAssociatedTokenAddress } = await import('@solana/spl-token');
      const adminAta = await getAssociatedTokenAddress(IDRX_MINT, publicKey);

      await program.methods
        .startBatch()
        .accounts({
          globalState: globalStatePda,
          batch: batchPda,
          batchVault: vaultPda,
          adminTokenAccount: adminAta,
          admin: publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc();

      await refetch();
      showSuccess('Batch Started!', `Batch ${batchId} is now LIVE on-chain. 🟢`);
    } catch (error) {
      console.error(error);
      showError('Operation Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleHarvestBatch = async (batchId: number, batchPda: anchor.web3.PublicKey) => {
    if (!program || !publicKey) return;
    try {
      setIsLoading(true);
      const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('global_state')], program.programId);
      const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('batch_vault'), new anchor.BN(batchId).toArrayLike(Buffer, 'le', 8)], program.programId);
      const IDRX_MINT = new anchor.web3.PublicKey('CHyZcyVYWNpXDxHtuLEZyw7xwyPCkj9G8DzLj3gvtsPx');
      const { getAssociatedTokenAddress } = await import('@solana/spl-token');
      const adminAta = await getAssociatedTokenAddress(IDRX_MINT, publicKey);

      const batch = batches.find((b) => b.batchId === batchId);
      const revenue = (batch?.maxCapacity || 0) + (batch?.estimatedProfit || 0);
      const revenueRaw = new anchor.BN(revenue).mul(new anchor.BN(10).pow(new anchor.BN(9)));

      await program.methods
        .harvestBatch(revenueRaw)
        .accounts({
          globalState: globalStatePda,
          batch: batchPda,
          batchVault: vaultPda,
          adminTokenAccount: adminAta,
          admin: publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc();

      await refetch();
      showSuccess('Batch Harvested!', `Batch settled on-chain. All funds distributed. 💸`);
    } catch (error) {
      console.error(error);
      showError('Harvest Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-black text-grass-primary border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Admin</h1>
          </div>
          <p className="text-grass-subtext max-w-2xl font-black uppercase text-[9px] tracking-widest leading-tight">
            Protocol & Batch Management 🏛️
          </p>
        </div>
      </div>

      <AdminStats stats={adminStats} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-black border-dashed">
        <div className="flex gap-4">
          {!isInitialized && (
            <button
              onClick={handleInitializeProtocol}
              className="flex items-center gap-2 px-4 py-2 bg-grass-primary text-black font-black uppercase text-[9px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all animate-in slide-in-from-left duration-500"
            >
              <ShieldCheck size={14} /> Initialize Protocol
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-grass-primary font-black uppercase text-[9px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(181,255,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <Plus size={14} /> New Batch
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-black rounded-[24px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[400px]">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black border-dashed">
          <h3 className="text-xl font-black uppercase tracking-tighter italic">Overview</h3>
          <button onClick={() => refetch()} className="flex items-center gap-2 text-[8px] font-black uppercase text-grass-primary bg-black px-3 py-1 rounded-full hover:scale-105 transition-transform">
            <RefreshCw size={10} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {batches.map((batch) => (
            <AdminBatchCard key={batch.batchId} batch={batch} isLoading={isLoading} onStart={handleStartBatch} onHarvest={handleHarvestBatch} />
          ))}
          {batches.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <RefreshCw size={40} className="text-grass-subtext mb-4 opacity-20" />
              <p className="font-black uppercase text-grass-subtext text-[10px] tracking-widest">No active batches.</p>
            </div>
          )}
        </div>
      </div>

      <CreateSeriesModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        formData={formData}
        setFormData={setFormData}
        calculatedApy={calculatedApy}
        stakingEnd={stakingEnd}
        isLoading={isLoading}
        onCreate={handleCreateBatch}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </>
  );
};

export default AdminPage;
