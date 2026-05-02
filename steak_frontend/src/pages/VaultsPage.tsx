import { StatsRow, VaultCard } from '../components/Dashboard';
import { useSteakProgram } from '../hooks/useSteakProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';

const VaultsPage = () => {
  const { publicKey } = useWallet();
  const program = useSteakProgram();

  const handleStake = async (vaultId: string, amount: number) => {
    if (!publicKey) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      console.log(`Staking ${amount} IDRX to vault ${vaultId}...`, { program, anchor });

      // CONTOH PEMANGGILAN CONTRACT:
      /*
      const tx = await program.methods
        .stake(new anchor.BN(amount))
        .accounts({
          user: publicKey,
          // ... tambahkan account lain sesuai IDL
        })
        .rpc();
      console.log('Transaction success:', tx);
      */

      alert('Mock Stake Successful! (Check console for code example)');
    } catch (error) {
      console.error('Stake failed:', error);
      alert('Stake failed! See console for details.');
    }
  };

  const vaults = [
    {
      id: '1',
      name: 'Batch #1446H - Premium Goats',
      duration: 30,
      roi: '32-45%',
      type: 'Capra Aegagrus',
    },
    {
      id: '2',
      name: 'Batch #1447K - Wagyu Bulls',
      duration: 90,
      roi: '55-80%',
      type: 'Bos Taurus',
    },
    {
      id: '3',
      name: 'Batch #1448S - Merino Sheep',
      duration: 60,
      roi: '40-55%',
      type: 'Ovis Aries',
    },
    {
      id: '4',
      name: 'Batch #1449P - Angus Cattle',
      duration: 90,
      roi: '50-75%',
      type: 'Bos Taurus',
    },
    {
      id: '5',
      name: 'Batch #1450M - Berkshire Pigs',
      duration: 30,
      roi: '25-35%',
      type: 'Sus Scrofa',
    },
    {
      id: '6',
      name: 'Batch #1451H - Holstein Dairy',
      duration: 60,
      roi: '38-50%',
      type: 'Bos Taurus',
    },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2">Livestock Vaults</h1>
        <p className="text-zinc-400 max-w-2xl">
          Stake your IDRX to fund <b>Real World Animal</b> (RWA) assets. Earn real yield from
          sustainable livestock fattening with 50/50 profit sharing.
        </p>
      </div>

      <StatsRow />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Available Batches</h2>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold hover:bg-zinc-800 transition-colors">
            All Types
          </button>
          <button className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold hover:bg-zinc-800 transition-colors">
            By Yield
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {vaults.map((vault) => (
          <div key={vault.id} className="relative group">
            <VaultCard {...vault} />
            <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <button
                onClick={() => handleStake(vault.id, 1000000)}
                className="w-full py-3 bg-amber-500 text-zinc-950 font-black rounded-xl shadow-xl hover:bg-amber-600 transition-all transform hover:scale-[1.02] active:scale-95"
              >
                STAKE NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VaultsPage;
