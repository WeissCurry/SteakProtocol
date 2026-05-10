import React from 'react';
import { Play, Wallet, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import * as anchor from '@coral-xyz/anchor';
import { MappedBatch } from '../../types/steak';

interface AdminBatchCardProps {
  batch: MappedBatch;
  isLoading: boolean;
  onStart: (batchId: number, publicKey: anchor.web3.PublicKey) => void;
  onHarvest: (batchId: number, publicKey: anchor.web3.PublicKey) => void;
}

export const AdminBatchCard: React.FC<AdminBatchCardProps> = ({
  batch,
  isLoading,
  onStart,
  onHarvest,
}) => {
  const percentage = Math.min(100, (batch.totalStaked / batch.maxCapacity) * 100);

  return (
    <div className="border-2 border-black rounded-[24px] p-6 flex flex-col items-stretch gap-6 hover:bg-grass-bg/10 transition-all">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-black text-white border-2 border-black rounded-3xl flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(181,255,0,1)]">
            <span className="text-[8px] font-black opacity-60 uppercase">BATCH</span>
            <span className="text-xl font-black italic">{batch.batchId}</span>
          </div>
          <div>
            <h4 className="text-xl font-black uppercase tracking-tighter">{batch.id}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-[8px] font-black bg-grass-primary border-2 border-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <TrendingUp size={10} /> {batch.apy} APY
              </span>
              <span className="text-[8px] font-black bg-white border-2 border-black px-2 py-0.5 rounded-full uppercase text-grass-subtext flex items-center gap-1">
                <Calendar size={10} /> {batch.lockDuration} Days
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!batch.isActive && !batch.isHarvested && (
            <button
              onClick={() => onStart(batch.batchId, batch.publicKey)}
              disabled={isLoading}
              className="px-6 py-3 bg-black text-white font-black uppercase text-[9px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(181,255,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
            >
              <Play size={14} /> Start
            </button>
          )}
          {batch.isActive && (
            <div className="flex flex-col items-end gap-1.5">
              <div className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 border border-amber-200 rounded-lg shadow-[1px_1px_0px_0px_rgba(251,191,36,1)]">
                Due: {(batch.maxCapacity + (batch.estimatedProfit || 0)).toLocaleString('en-US')}
              </div>
              <button
                onClick={() => onHarvest(batch.batchId, batch.publicKey)}
                disabled={isLoading}
                className="px-6 py-3 bg-grass-primary text-black font-black uppercase text-[9px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
              >
                <Wallet size={14} /> Harvest
              </button>
            </div>
          )}
          {batch.isHarvested && (
            <div className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 font-black uppercase text-[9px] border-2 border-emerald-500 rounded-xl italic">
              <CheckCircle2 size={14} /> Settled
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t-2 border-black border-dashed space-y-1.5">
        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
          <span className="text-grass-subtext">Funding</span>
          <span className="text-black">
            {batch.totalStaked.toLocaleString('en-US')} /{' '}
            {batch.maxCapacity.toLocaleString('en-US')}
          </span>
        </div>
        <div className="h-3 w-full bg-zinc-100 border-2 border-black rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full bg-grass-primary border-r-2 border-black transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[8px] font-black uppercase text-grass-subtext text-right">
          {percentage.toFixed(1)}% Full
        </p>
      </div>
    </div>
  );
};
