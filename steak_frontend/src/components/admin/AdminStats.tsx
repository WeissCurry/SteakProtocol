import React from 'react';
import { TrendingUp, ArrowUpRight, Wallet, ShieldCheck, Calculator, RefreshCw } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    profitThisMonth: number;
    pendingDeposits: number;
    countLast3Months: number;
  };
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="bg-white border-2 border-black p-6 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(181,255,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all group">
        <div className="w-12 h-12 rounded-xl bg-grass-bg border-2 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:bg-grass-primary transition-colors">
          <TrendingUp size={24} className="text-black" />
        </div>
        <p className="text-grass-subtext text-[9px] font-black uppercase tracking-widest mb-1">
          Monthly Profit
        </p>
        <h3 className="text-xl font-black text-black uppercase tracking-tighter italic">
          Rp {stats.profitThisMonth.toLocaleString('id-ID')}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase">
          <ArrowUpRight size={10} /> Real-time
        </div>
      </div>

      <div className="bg-white border-2 border-black p-5 rounded-[20px] shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-amber-400 transition-colors">
          <Wallet size={20} className="text-black" />
        </div>
        <p className="text-grass-subtext text-[9px] font-black uppercase tracking-widest mb-1">
          Harvest Due
        </p>
        <h3 className="text-xl font-black text-black uppercase tracking-tighter italic">
          Rp {stats.pendingDeposits.toLocaleString('id-ID')}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase">
          <ShieldCheck size={10} /> Total Due
        </div>
      </div>

      <div className="bg-white border-2 border-black p-5 rounded-[20px] shadow-[4px_4px_0px_0px_rgba(56,189,248,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group">
        <div className="w-10 h-10 rounded-xl bg-sky-50 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-sky-400 transition-colors">
          <Calculator size={20} className="text-black" />
        </div>
        <p className="text-grass-subtext text-[9px] font-black uppercase tracking-widest mb-1">
          Recent Series (3M)
        </p>
        <h3 className="text-xl font-black text-black uppercase tracking-tighter italic">
          {stats.countLast3Months} BATCHES
        </h3>
        <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-sky-500 uppercase">
          <RefreshCw size={10} /> Active
        </div>
      </div>
    </div>
  );
};
