import { StatsRow, VaultCard } from '../components/Dashboard';
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
import { TOKEN_PROGRAM_ID, createMintToInstruction } from '@solana/spl-token';
import { RefreshCw, Plus, ShieldCheck, Coins } from 'lucide-react';

const IDRX_MINT = new anchor.web3.PublicKey('9FKKcv9DEX6wq3eC8Y8qESBgqzgTqAdBUtadaft6KzYU');

const VaultsPage = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const program = useSteakProgram();
  const { data: batches, isLoading, refetch } = useBatches();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleStake = async (batchId: number, amount: number) => {
    if (!publicKey || !signTransaction || !program) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setIsDeploying(true);
      const stakeAmount = new anchor.BN(amount);
      const batchIdBN = new anchor.BN(batchId);

      const batch = getBatchAddress(batchId, program.programId);
      const batchVault = getBatchVaultAddress(batchId, program.programId);
      const userStake = getUserStakeAddress(publicKey, batchId, program.programId);
      const globalState = getGlobalStateAddress(program.programId);

      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        IDRX_MINT,
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

      alert('Stake Successful!');
      refetch();
    } catch (error) {
      console.error('Stake failed:', error);
      alert('Stake failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleFaucet = async () => {
    if (!publicKey || !signTransaction) return;
    try {
      setIsDeploying(true);
      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        IDRX_MINT,
        publicKey,
        signTransaction,
      );

      const tx = new anchor.web3.Transaction().add(
        createMintToInstruction(
          IDRX_MINT,
          userTokenAccount,
          publicKey,
          10_000_000_000, // 10,000 IDRX
        ),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig);

      alert('Faucet Success! 10,000 IDRX minted.');
    } catch (error) {
      alert('Faucet Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!publicKey || !program) return;
    try {
      setIsDeploying(true);
      const nextId = (batches?.length || 0) + 1;
      const batchId = new anchor.BN(nextId);
      const duration = new anchor.BN(30 * 24 * 60 * 60);

      const batch = getBatchAddress(nextId, program.programId);
      const batchVault = getBatchVaultAddress(nextId, program.programId);

      await program.methods
        .createBatch(batchId, duration)
        .accounts({
          batch,
          batchVault,
          usdcMint: IDRX_MINT,
          admin: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      alert('New Batch Created!');
      refetch();
    } catch (error) {
      alert('Failed: ' + (error instanceof Error ? error.message : String(error)));
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

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">Livestock Vaults</h1>
          <p className="text-zinc-400 max-w-2xl">
            Stake your <b>IDRX</b> to fund Real World Animal (RWA) assets. Earn real yield from
            sustainable livestock fattening.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            disabled={isDeploying}
            onClick={handleFaucet}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Coins size={14} />
            {isDeploying ? '...' : 'GET TEST IDRX'}
          </button>
          <button
            disabled={isDeploying}
            onClick={handleInitialize}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
          >
            <ShieldCheck size={14} className="text-amber-500" />
            {isDeploying ? '...' : 'INIT'}
          </button>
          <button
            disabled={isDeploying}
            onClick={handleCreateBatch}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 text-xs font-black rounded-xl hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50"
          >
            <Plus size={14} />
            {isDeploying ? '...' : 'NEW BATCH'}
          </button>
        </div>
      </div>

      <StatsRow />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">On-Chain Batches</h2>
          {isLoading && <RefreshCw size={16} className="animate-spin text-zinc-500" />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {batches && batches.length > 0 ? (
          batches.map((b: ProgramAccount<BatchAccount>) => (
            <VaultCard
              key={b.publicKey.toBase58()}
              id={b.account.batchId.toString()}
              name={`Batch #${b.account.batchId.toString()} - ${b.account.isActive ? 'Active' : 'Funding'}`}
              duration={Number(b.account.lockDuration) / (24 * 60 * 60)}
              roi={b.account.isActive ? '32-45%' : 'Pending'}
              type="Bulls & Goats"
              onStake={() => handleStake(Number(b.account.batchId), 1000000)}
              isProcessing={isDeploying}
            />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-zinc-500">
              <RefreshCw size={32} />
            </div>
            <p className="text-zinc-400 font-medium">No batches found on-chain.</p>
            <p className="text-zinc-600 text-sm mt-1">Click "NEW BATCH" to start the demo.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default VaultsPage;
