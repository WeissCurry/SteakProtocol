import { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { RefreshCw, Filter } from 'lucide-react';
import * as anchor from '@coral-xyz/anchor';

import { useBatches } from '../hooks/useBatches';
import { useSteakProgram } from '../hooks/useSteakProgram';
import { StatsRow, SukukCard, PerformanceCard } from '../components/Dashboard';
import NotificationModal from '../components/NotificationModal';
import { CertificateModal } from '../components/dashboard/CertificateModal';

// Impure functions moved outside to satisfy react-hooks/purity
const generateActivityId = () => Math.random().toString(36).substring(2, 11);
const generateCertId = () =>
  `STEAK-CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
const getNow = () => Date.now();

const VaultsPage = () => {
  const { publicKey } = useWallet();
  const { data: blockchainBatches, refetch, isLoading } = useBatches();
  const program = useSteakProgram();

  const [isDeploying, setIsDeploying] = useState(false);
  const [filter, setFilter] = useState<'active' | 'finished'>('active');
  const [showNftModal, setShowNftModal] = useState(false);
  const [certificateId, setCertificateId] = useState<string>('');
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

  const [lastStakeInfo, setLastStakeInfo] = useState<{
    amount: number;
    duration: number;
    apy: string;
    batchId: number;
    timestamp: number;
    txSig?: string;
  } | null>(null);

  const batches = useMemo(() => {
    if (!blockchainBatches) return [];
    return blockchainBatches
      .map((b) => ({
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
        estimatedProfit: 0,
        startTime: b.account.startTime ? Number(b.account.startTime) : null,
        publicKey: b.publicKey,
      }))
      .sort((a, b) => b.batchId - a.batchId);
  }, [blockchainBatches]);

  const filteredBatches = useMemo(() => {
    if (filter === 'active') {
      return batches.filter((b) => !b.isHarvested);
    }
    return batches.filter((b) => b.isHarvested);
  }, [batches, filter]);

  const maturityDate = useMemo(() => {
    if (!lastStakeInfo) return '';
    return new Date(
      lastStakeInfo.timestamp + (lastStakeInfo.duration || 0) * 86400000,
    ).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }, [lastStakeInfo]);

  const handleStake = async (
    batchId: number,
    amount: number,
    duration: number,
    apy: string,
    seriesName: string,
  ) => {
    if (!publicKey || !program) {
      setNotification({
        isOpen: true,
        title: 'Wallet Required',
        message: 'Please connect your wallet first to invest in this series.',
        type: 'error',
      });
      return;
    }

    try {
      setIsDeploying(true);
      const bId = new anchor.BN(batchId);
      const amt = new anchor.BN(amount).mul(new anchor.BN(10).pow(new anchor.BN(9)));

      const [batchPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('batch'), bId.toArrayLike(Buffer, 'le', 8)],
        program.programId,
      );
      const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('batch_vault'), bId.toArrayLike(Buffer, 'le', 8)],
        program.programId,
      );
      const [userStakePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('user_stake'), publicKey.toBuffer(), bId.toArrayLike(Buffer, 'le', 8)],
        program.programId,
      );

      const IDRX_MINT = new anchor.web3.PublicKey('CHyZcyVYWNpXDxHtuLEZyw7xwyPCkj9G8DzLj3gvtsPx');
      const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('global_state')],
        program.programId,
      );
      const { getAssociatedTokenAddress } = await import('@solana/spl-token');
      const userAta = await getAssociatedTokenAddress(IDRX_MINT, publicKey);

      const tx = await program.methods
        .stake(bId, amt)
        .accounts({
          batch: batchPda,
          batchVault: vaultPda,
          userStake: userStakePda,
          globalState: globalStatePda,
          userTokenAccount: userAta,
          user: publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const newActivity = {
        id: generateActivityId(),
        type: 'STAKE' as const,
        amount,
        date: new Date().toISOString(),
        status: 'SUCCESS' as const,
        batchId,
        duration,
        seriesName: seriesName || `SS${String(batchId).padStart(3, '0')}`,
      };
      const history = JSON.parse(localStorage.getItem('steak_activities') || '[]');
      localStorage.setItem('steak_activities', JSON.stringify([newActivity, ...history]));

      const certId = generateCertId();
      setCertificateId(certId);
      setLastStakeInfo({ amount, duration, apy, batchId, timestamp: getNow(), txSig: tx });
      setShowNftModal(true);
      await refetch();
    } catch (error) {
      console.error(error);
      setNotification({
        isOpen: true,
        title: 'Stake Failed',
        message: error instanceof Error ? error.message : String(error),
        type: 'error',
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <>
      <StatsRow batches={batches} />
      <PerformanceCard batches={batches} />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b-2 border-black border-dashed gap-4">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Featured Pools</h2>
          <div className="flex bg-black p-1 rounded-xl border-2 border-black">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                filter === 'active'
                  ? 'bg-grass-primary text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('finished')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                filter === 'finished'
                  ? 'bg-grass-primary text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Finished
            </button>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-[8px] font-black uppercase text-grass-primary bg-black px-4 py-2 rounded-full hover:scale-105 transition-transform shadow-[3px_3px_0px_0px_rgba(181,255,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
        >
          <RefreshCw size={12} className={isLoading || isDeploying ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-zinc-100 border-2 border-black rounded-[32px] animate-pulse flex flex-col p-8 gap-6"
            >
              <div className="w-24 h-6 bg-zinc-200 rounded-full border border-black/10" />
              <div className="w-48 h-8 bg-zinc-200 rounded-lg border border-black/10" />
              <div className="mt-auto w-full h-12 bg-zinc-200 rounded-xl border border-black/10" />
            </div>
          ))
        ) : filteredBatches.length > 0 ? (
          filteredBatches.map((batch) => (
            <SukukCard
              key={batch.batchId}
              id={batch.id}
              name={batch.name || batch.id}
              duration={batch.lockDuration}
              roi={`${batch.apy} APY`}
              quota={batch.totalStaked}
              maxQuota={batch.maxCapacity}
              isProcessing={isDeploying}
              isActive={batch.isActive}
              isHarvested={batch.isHarvested}
              goats={batch.goats}
              cows={batch.cows}
              onStake={(amt) =>
                handleStake(batch.batchId, amt, batch.lockDuration, batch.apy, batch.name)
              }
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30">
            <Filter size={48} className="mb-4" />
            <p className="font-black uppercase text-sm tracking-widest text-center">
              No pools found in this category.
            </p>
          </div>
        )}
      </div>

      <CertificateModal
        isOpen={showNftModal}
        onClose={() => setShowNftModal(false)}
        stakeInfo={lastStakeInfo}
        maturityDate={maturityDate}
        certificateId={certificateId}
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

export default VaultsPage;
