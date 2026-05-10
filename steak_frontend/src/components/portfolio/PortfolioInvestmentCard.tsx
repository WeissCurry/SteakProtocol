import React from 'react';
import { TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { Activity } from '../../types/steak';

interface InvestmentCardProps {
  activity: Activity;
  onWithdraw: (activity: Activity) => void | Promise<void>;
  isWithdrawing: boolean;
  onViewNFT: (activity: Activity) => void | Promise<void>;
}

export const PortfolioInvestmentCard: React.FC<InvestmentCardProps> = ({
  activity,
  onWithdraw,
  isWithdrawing,
  onViewNFT,
}) => {
  return (
    <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center justify-between gap-8 group hover:bg-grass-bg/30 transition-all">
      <div className="flex items-center gap-8">
        <div className="w-20 h-20 bg-black text-grass-primary border-2 border-black rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-3 transition-transform">
          <span className="text-3xl">🥩</span>
        </div>
        <div>
          <h4 className="text-2xl font-black uppercase tracking-tighter italic">
            {activity.seriesName || activity.series || `Series #${activity.batchId}`}
          </h4>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black bg-grass-primary border-2 border-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp size={12} /> {activity.apy || '6.25%'} APY
            </span>
            <span className="text-[10px] font-black bg-white border-2 border-black px-3 py-1 rounded-full uppercase text-grass-subtext flex items-center gap-1">
              <Calendar size={12} /> {activity.duration} Days
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="text-center lg:text-right">
          <p className="text-[10px] font-black uppercase text-grass-subtext mb-1 tracking-widest">
            Principal Investment
          </p>
          <p className="text-2xl font-black">
            {activity.amount.toLocaleString('en-US')}{' '}
            <span className="text-xs text-grass-subtext">IDRX</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewNFT(activity)}
            className="px-6 py-4 bg-white border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            VIEW NFT
          </button>
          <button
            onClick={() => onWithdraw(activity)}
            disabled={isWithdrawing}
            className={`px-8 py-4 ${isWithdrawing ? 'bg-zinc-200' : 'bg-black text-grass-primary'} border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2`}
          >
            {isWithdrawing ? <RefreshCw size={14} className="animate-spin" /> : 'CLAIM PROCEEDS'}
          </button>
        </div>
      </div>
    </div>
  );
};
