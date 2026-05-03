import { Briefcase, TrendingUp, Gem, Clock, ArrowUpRight, Download } from 'lucide-react';

const PortfolioPage = () => {
  const stats = [
    {
      label: 'Total Invested',
      value: '12,500,000',
      sub: 'IDRX',
      icon: Gem,
      color: 'bg-grass-primary',
    },
    {
      label: 'Est. Earnings',
      value: '768,450',
      sub: '+6.25% Avg',
      icon: TrendingUp,
      color: 'bg-emerald-400',
    },
    {
      label: 'Claimable',
      value: '124,500',
      sub: 'IDRX Rewards',
      icon: ArrowUpRight,
      color: 'bg-sky-400',
    },
  ];

  const activeStakes = [
    { id: 'SS001', amount: '5,000,000', apy: '6.15%', daysLeft: 12, status: 'Active' },
    { id: 'SS002', amount: '7,500,000', apy: '6.40%', daysLeft: 45, status: 'Active' },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter">My Portfolio 💼</h1>
        <p className="text-grass-subtext max-w-2xl font-black uppercase text-sm tracking-tight leading-tight">
          Track your active stakes, pending rewards, and historical performance. 🐐🌿
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-2 border-black p-6 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 right-0 w-12 h-12 ${stat.color} border-l-2 border-b-2 border-black flex items-center justify-center rounded-bl-2xl`}
            >
              <stat.icon size={20} className="text-black" />
            </div>
            <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black text-black italic tracking-tighter">{stat.value}</h3>
            <p className="text-[10px] font-black text-black/40 uppercase mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-10 pb-6 border-b-2 border-black border-dashed">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center rounded-xl">
              <Briefcase size={22} className="text-grass-primary" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">
              Your Active Series
            </h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Download size={14} />
            Export Data
          </button>
        </div>

        <div className="space-y-4">
          {activeStakes.map((stake) => (
            <div
              key={stake.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 border-2 border-black rounded-2xl hover:bg-grass-bg/30 transition-all group"
            >
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className="w-14 h-14 bg-black text-white border-2 border-black rounded-xl flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_rgba(181,255,0,1)]">
                  <span className="text-[8px] font-black uppercase opacity-60">ID</span>
                  <span className="text-sm font-black italic">{stake.id}</span>
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight">
                    Steak Series {stake.id}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black bg-grass-primary border border-black px-2 py-0.5 rounded uppercase">
                      {stake.apy} APR
                    </span>
                    <div className="flex items-center gap-1 text-grass-subtext">
                      <Clock size={12} />
                      <span className="text-[10px] font-black uppercase">
                        {stake.daysLeft} Hari Tersisa
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-grass-subtext mb-1">
                    Staked Amount
                  </p>
                  <p className="text-xl font-black italic">
                    {stake.amount} <span className="text-xs not-italic">IDRX</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(181,255,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(181,255,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                    Detail NFT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PortfolioPage;
