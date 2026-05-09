import React from 'react';
import { Calculator, X, ChevronRight, Calendar, RefreshCw } from 'lucide-react';

interface CreateSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  calculatedApy: string;
  stakingEnd: string;
  isLoading: boolean;
  onCreate: () => void;
}

export const CreateSeriesModal: React.FC<CreateSeriesModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  calculatedApy,
  stakingEnd,
  isLoading,
  onCreate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black w-full max-w-4xl rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-black p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Calculator className="text-grass-primary" size={18} />
            <h3 className="font-black uppercase italic tracking-tighter text-base">
              Create New Series 🥩
            </h3>
          </div>
          <button onClick={onClose} className="hover:text-grass-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-black uppercase text-grass-subtext mb-1 block tracking-widest">
                  Series Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl font-black text-base focus:bg-grass-primary/5 transition-all outline-none"
                  placeholder="e.g. SS001"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8px] font-black uppercase text-grass-subtext mb-1 block tracking-widest">
                    Quota (IDRX)
                  </label>
                  <input
                    type="text"
                    value={formData.quota.toLocaleString('en-US')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, quota: Number(val) });
                    }}
                    className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl font-black text-base outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-grass-subtext mb-1 block tracking-widest">
                    Lock (Days)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl font-black text-base outline-none"
                  >
                    <option value={30}>30 Days</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8px] font-black uppercase text-grass-subtext mb-1 block tracking-widest">
                    Goats 🐐
                  </label>
                  <input
                    type="number"
                    value={formData.goats}
                    onChange={(e) => setFormData({ ...formData, goats: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl font-black text-base outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-grass-subtext mb-1 block tracking-widest">
                    Cows 🐄
                  </label>
                  <input
                    type="number"
                    value={formData.cows}
                    onChange={(e) => setFormData({ ...formData, cows: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl font-black text-base outline-none"
                  />
                </div>
              </div>

              <div className="bg-grass-bg/50 border-2 border-black border-dashed p-4 rounded-2xl">
                <p className="text-[8px] font-black uppercase text-grass-subtext mb-3 flex items-center gap-2">
                  <Calendar size={12} /> Schedule
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[7px] font-black uppercase opacity-60 mb-1 block">
                      Open Date
                    </label>
                    <input
                      type="date"
                      value={formData.openStart}
                      onChange={(e) => setFormData({ ...formData, openStart: e.target.value })}
                      className="bg-transparent font-black text-xs outline-none w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[7px] font-black uppercase opacity-60 mb-1 block">
                      Maturity
                    </label>
                    <p className="font-black text-xs text-black">{stakingEnd}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Yield Calculation */}
            <div className="space-y-4">
              <div className="bg-white border-2 border-black p-5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black uppercase text-[9px] mb-4 border-b-2 border-black pb-1">
                  Yield Config 📈
                </h4>
                <div>
                  <label className="text-[8px] font-black uppercase text-grass-subtext mb-1 block tracking-widest">
                    Target Profit (IDRX)
                  </label>
                  <input
                    type="text"
                    value={formData.profit.toLocaleString('en-US')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, profit: Number(val) });
                    }}
                    className="w-full bg-white border-2 border-black p-3 rounded-xl font-black text-base mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  />
                </div>

                <div className="bg-black text-white p-4 rounded-2xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(181,255,0,1)]">
                  <p className="text-[8px] font-black uppercase opacity-60 mb-1 tracking-widest">
                    Projected APY
                  </p>
                  <div className="flex items-end gap-1">
                    <h4 className="text-2xl font-black italic text-grass-primary">
                      {calculatedApy}%
                    </h4>
                    <span className="text-[7px] font-black uppercase mb-1">P.A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onCreate}
            disabled={isLoading}
            className="w-full mt-6 py-4 bg-black text-grass-primary font-black uppercase tracking-widest text-[10px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(181,255,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <>
                Create Series <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
