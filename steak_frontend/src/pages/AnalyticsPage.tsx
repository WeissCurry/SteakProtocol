import { useState } from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, Clock } from 'lucide-react';
import { PortfolioActivityTable } from '../components/portfolio/PortfolioActivityTable';

import { Activity } from '../types/steak';

const AnalyticsPage = () => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('steak_activities');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const metrics = [
    { label: 'Total TVL', value: 'Rp 194.2 M', icon: TrendingUp },
    { label: 'Protocol Users', value: '1.240', icon: Users },
    { label: 'Insurance Fund', value: 'Rp 450 Jt', icon: ShieldCheck },
    { label: 'Avg. ROI', value: '42.8%', icon: BarChart3 },
  ];

  const handleClearHistory = () => {
    localStorage.removeItem('steak_activities');
    setActivities([]);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter italic text-black">
          Analytics
        </h1>
        <p className="text-grass-subtext max-w-2xl font-black uppercase text-[9px] tracking-widest leading-tight">
          Protocol activity log 📝
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white border-2 border-black p-6 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-grass-bg border-2 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <metric.icon size={24} className="text-black" />
            </div>
            <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-1">
              {metric.label}
            </p>
            <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic">
              {metric.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 italic">
          <Clock className="text-black" size={18} /> History
        </h3>
        <button
          onClick={handleClearHistory}
          className="px-4 py-1.5 bg-red-500 text-white text-[9px] font-black uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
          Reset
        </button>
      </div>

      <PortfolioActivityTable activities={activities} />
    </>
  );
};

export default AnalyticsPage;
