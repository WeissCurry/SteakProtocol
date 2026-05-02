import { Briefcase } from 'lucide-react';

const PortfolioPage = () => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2">My Portfolio</h1>
        <p className="text-zinc-400 max-w-2xl">
          Track your active stakes, pending rewards, and historical performance.
        </p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="text-zinc-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Active Stakes</h2>
        <p className="text-zinc-500 max-w-md mb-8">
          You haven't staked any IDRX yet. Browse our available livestock vaults to start earning
          yield.
        </p>
        <button className="px-8 py-3 bg-amber-500 text-zinc-950 font-bold rounded-xl hover:bg-amber-600 transition-colors">
          Explore Vaults
        </button>
      </div>
    </>
  );
};

export default PortfolioPage;
