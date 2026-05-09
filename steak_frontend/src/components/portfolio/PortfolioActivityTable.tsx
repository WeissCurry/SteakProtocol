import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface ActivityTableProps {
  activities: any[];
}

export const PortfolioActivityTable: React.FC<ActivityTableProps> = ({ activities }) => {
  return (
    <div className="bg-white border-2 border-black rounded-[32px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="p-8 border-b-2 border-black bg-zinc-50 flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-tighter italic">Recent Activity</h3>
        <div className="px-3 py-1 bg-black text-grass-primary text-[10px] font-black uppercase rounded-full">
          On-Chain Verified
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-grass-subtext tracking-widest bg-zinc-50/50">
                Type
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-grass-subtext tracking-widest bg-zinc-50/50">
                Series
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-grass-subtext tracking-widest bg-zinc-50/50">
                Amount
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-grass-subtext tracking-widest bg-zinc-50/50 text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/5">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-grass-bg/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${activity.type === 'STAKE' ? 'bg-grass-primary animate-pulse' : 'bg-black'}`}
                    />
                    <span className="font-black text-sm uppercase tracking-tighter">
                      {activity.type}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black text-grass-subtext uppercase">
                    {activity.seriesName || activity.series || `Batch #${activity.batchId}`}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black text-black">
                    {activity.amount.toLocaleString('id-ID')} IDRX
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> {activity.status}
                    </span>
                    {activity.txSig && (
                      <a
                        href={`https://explorer.solana.com/tx/${activity.txSig}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-black hover:text-grass-primary border border-transparent hover:border-black rounded-lg transition-all"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <p className="text-grass-subtext font-black uppercase text-xs tracking-widest">
                    Belum ada aktivitas transaksi. 🚜
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
