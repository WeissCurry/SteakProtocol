import React from 'react';
import { TrendingUp, ArrowUpRight, Gem, Clock } from 'lucide-react';

interface PortfolioStatsProps {
  totalInvested: number;
  estProfit: number;
}

export const PortfolioStats: React.FC<PortfolioStatsProps> = ({ totalInvested, estProfit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="bg-white border-2 border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(181,255,0,1)] relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black text-grass-primary rounded-xl flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp size={20} />
            </div>
            <p className="text-grass-subtext text-xs font-black uppercase tracking-widest">Total Investasi</p>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-black text-black">Rp {totalInvested.toLocaleString('id-ID')}</h3>
            <span className="text-[10px] font-black px-3 py-1 bg-grass-primary border-2 border-black rounded-full uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ArrowUpRight size={12} /> SECURED
            </span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-grass-primary/10 rounded-full blur-3xl group-hover:bg-grass-primary/20 transition-colors" />
      </div>

      <div className="bg-white border-2 border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black text-grass-primary rounded-xl flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Gem size={20} />
            </div>
            <p className="text-grass-subtext text-xs font-black uppercase tracking-widest">Estimasi Bagi Hasil</p>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-black text-black">Rp {estProfit.toLocaleString('id-ID')}</h3>
            <span className="text-[10px] font-black px-3 py-1 bg-black text-grass-primary border-2 border-black rounded-full uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(181,255,0,1)]">
              <Clock size={12} /> ACCRUING
            </span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-grass-primary/10 rounded-full blur-3xl group-hover:bg-grass-primary/20 transition-colors" />
      </div>
    </div>
  );
};
