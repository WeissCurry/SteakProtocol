import { Briefcase, RefreshCw } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useSteakProgram } from '../hooks/useSteakProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { useBatches } from '../hooks/useBatches';
import { Activity } from '../types/steak';

import NotificationModal from '../components/NotificationModal';
import { PortfolioStats } from '../components/portfolio/PortfolioStats';
import { PortfolioInvestmentCard } from '../components/portfolio/PortfolioInvestmentCard';
import { CertificateModal } from '../components/dashboard/CertificateModal';

const PortfolioPage = () => {
  const { publicKey } = useWallet();
  const program = useSteakProgram();
  const { refetch } = useBatches();

  const [activities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('steak_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success';
  }>({ isOpen: false, title: '', message: '', type: 'success' });
  const [showNftModal, setShowNftModal] = useState(false);
  const [selectedStake, setSelectedStake] = useState<Activity | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState<string | null>(null);

  const portfolioStats = useMemo(() => {
    const totalInvested = activities
      .filter((a) => a.type === 'STAKE')
      .reduce((sum, a) => sum + a.amount, 0);
    const estProfit = activities
      .filter((a) => a.type === 'STAKE')
      .reduce((sum, a) => {
        const apy = parseFloat(a.apy || '6.25');
        return sum + a.amount * (apy / 100) * ((a.duration || 0) / 365);
      }, 0);
    return { totalInvested, estProfit };
  }, [activities]);

  const activeInvestments = useMemo<Activity[]>(
    () => activities.filter((a) => a.type === 'STAKE'),
    [activities],
  );

  const handleWithdraw = async (stake: Activity) => {
    if (!program || !publicKey || !stake.batchId) return;
    try {
      setIsWithdrawing(stake.id);
      const bId = new anchor.BN(stake.batchId);
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
      const { getAssociatedTokenAddress } = await import('@solana/spl-token');
      const userAta = await getAssociatedTokenAddress(IDRX_MINT, publicKey);

      await program.methods
        .claim()
        .accounts({
          batch: batchPda,
          batchVault: vaultPda,
          userStake: userStakePda,
          userTokenAccount: userAta,
          user: publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc();

      setNotification({
        isOpen: true,
        title: 'Claim Success!',
        message: `Investment proceeds from ${stake.series || 'Batch'} successfully claimed to wallet. 💸`,
        type: 'success',
      });
      await refetch();
    } catch (error) {
      console.error(error);
      setNotification({
        isOpen: true,
        title: 'Claim Failed',
        message: error instanceof Error ? error.message : String(error),
        type: 'error',
      });
    } finally {
      setIsWithdrawing(null);
    }
  };

  const handleViewNFT = (stake: Activity) => {
    setSelectedStake(stake);
    setShowNftModal(true);
  };

  const maturityDate = useMemo(() => {
    if (!selectedStake) return '';
    const ts = new Date(selectedStake.date).getTime();
    return new Date(ts + (selectedStake.duration || 0) * 86400000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }, [selectedStake]);

  return (
    <>
      <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-black border-dashed">
        <div className="w-10 h-10 bg-black text-grass-primary border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Briefcase size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Portfolio</h1>
          <p className="text-[9px] font-black uppercase text-grass-subtext tracking-widest mt-0.5">
            Active Assets
          </p>
        </div>
      </div>

      <PortfolioStats {...portfolioStats} />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black uppercase tracking-tighter italic">Active</h3>
          <div className="h-px flex-1 mx-6 bg-black/10" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activeInvestments.map((activity: Activity) => (
            <PortfolioInvestmentCard
              key={activity.id}
              activity={activity}
              onWithdraw={handleWithdraw}
              isWithdrawing={isWithdrawing === activity.id}
              onViewNFT={handleViewNFT}
            />
          ))}
          {activeInvestments.length === 0 && (
            <div className="bg-zinc-50 border-2 border-black border-dashed rounded-[24px] py-16 text-center flex flex-col items-center">
              <RefreshCw size={32} className="text-grass-subtext/20 mb-3" />
              <p className="font-black uppercase text-grass-subtext text-[10px] tracking-widest mb-4">
                No active investments.
              </p>
              <Link
                to="/app/earn"
                className="px-6 py-2 bg-black text-grass-primary border-2 border-black font-black uppercase text-[9px] shadow-[3px_3px_0px_0px_rgba(181,255,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                Start Stake
              </Link>
            </div>
          )}
        </div>
      </div>

      <CertificateModal
        isOpen={showNftModal}
        onClose={() => setShowNftModal(false)}
        stakeInfo={
          selectedStake
            ? { ...selectedStake, timestamp: new Date(selectedStake.date).getTime() }
            : null
        }
        maturityDate={maturityDate}
        certificateId={selectedStake?.certificateId || 'STEAK-CERT-MOCK'}
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

export default PortfolioPage;
