import React, { useState } from 'react';
import { X, Calendar, Target, TrendingUp } from 'lucide-react';

interface CreateSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (days: number, capacity: number, apy: number) => void;
  isProcessing: boolean;
}

export const CreateSeriesModal = ({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
}: CreateSeriesModalProps) => {
  const [days, setDays] = useState(30);
  const [capacity, setCapacity] = useState(5000000);
  const [apy, setApy] = useState(615);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black w-full max-w-md rounded-none overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-black uppercase tracking-tighter">
                Open New Series
              </h3>
              <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mt-1">
                Series Configuration 🐐🛠️
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 border-2 border-black hover:bg-grass-primary transition-colors text-black"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Duration */}
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-black mb-3 block">
                Lock Duration (Days)
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-black"
                  size={20}
                />
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full bg-white border-2 border-black rounded-none py-5 pl-14 pr-6 text-black font-black appearance-none focus:bg-grass-primary/10 outline-none text-lg transition-all"
                >
                  <option value={30}>30 Days (Short-term)</option>
                  <option value={60}>60 Days (Medium-term)</option>
                  <option value={90}>90 Days (Long-term)</option>
                </select>
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-black mb-3 block">
                Max Quota (IDRX)
              </label>
              <div className="relative">
                <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-black" size={20} />
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-white border-2 border-black rounded-none py-5 pl-14 pr-6 text-black font-black focus:bg-grass-primary/10 outline-none text-lg transition-all"
                  placeholder="Example: 5,000,000"
                />
              </div>
            </div>

            {/* APY */}
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-black mb-3 block">
                Fixed Rate APY (BPS)
              </label>
              <div className="relative">
                <TrendingUp
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-black"
                  size={20}
                />
                <input
                  type="number"
                  value={apy}
                  onChange={(e) => setApy(Number(e.target.value))}
                  className="w-full bg-white border-2 border-black rounded-none py-5 pl-14 pr-6 text-black font-black focus:bg-grass-primary/10 outline-none text-lg transition-all"
                  placeholder="615"
                />
              </div>
              <p className="text-[10px] text-grass-subtext mt-3 font-black uppercase tracking-tight">
                615 = 6.15% Fixed APY. 🌿
              </p>
            </div>
          </div>

          <button
            onClick={() => onSubmit(days, capacity, apy)}
            disabled={isProcessing}
            className="w-full mt-12 py-5 bg-grass-primary text-black border-2 border-black disabled:opacity-50 font-black rounded-none transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 text-lg uppercase tracking-widest"
          >
            {isProcessing ? 'PROCESSING...' : 'ACTIVATE SERIES'}
          </button>
        </div>
      </div>
    </div>
  );
};
