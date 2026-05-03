import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  amount: number;
  series: string;
  date: string;
  status: string;
}

const AnalyticsPage = () => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('steak_activities');
    if (saved) return JSON.parse(saved);

    // Default mock data
    const mock = [
      {
        id: '1',
        type: 'STAKE',
        amount: 5000000,
        series: 'SS001',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'SUCCESS',
      },
      {
        id: '2',
        type: 'STAKE',
        amount: 12500000,
        series: 'SS002',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'SUCCESS',
      },
    ];
    localStorage.setItem('steak_activities', JSON.stringify(mock));
    return mock;
  });

  // No need for useEffect for initial load now
  useEffect(() => {
    // Optionally sync or do other things, but initial load is handled
  }, []);

  const metrics = [
    { label: 'Total TVL', value: '$12.4M', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Protocol Users', value: '1,240', icon: Users, color: 'text-blue-400' },
    { label: 'Insurance Fund', value: '$450K', icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Avg. ROI', value: '42.8%', icon: BarChart3, color: 'text-amber-400' },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter">
          Protocol Activities 📝
        </h1>
        <p className="text-grass-subtext max-w-2xl font-black uppercase text-sm tracking-tight leading-tight">
          History of interactions and transactions within the Steak Protocol ecosystem. 🌍🐐
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white border-2 border-black p-6 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-grass-bg border-2 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${metric.color.replace('text-', 'text-black bg-')}`}
            >
              <metric.icon size={24} className="text-black" />
            </div>
            <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-1">
              {metric.label}
            </p>
            <h3 className="text-3xl font-black text-black uppercase tracking-tighter">
              {metric.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_rgba(181,255,0,1)] relative overflow-hidden min-h-[500px]">
        <div className="flex justify-between items-center mb-10 px-4">
          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Clock className="text-black" />
            Recent Interactions
          </h3>
          <button
            onClick={() => {
              localStorage.removeItem('steak_activities');
              setActivities([]);
            }}
            className="px-4 py-2 border-2 border-black text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all"
          >
            Clear History
          </button>
        </div>

        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="group flex items-center justify-between p-6 bg-white border-2 border-black rounded-2xl hover:translate-x-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-grass-primary border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <TrendingUp size={20} className="text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black uppercase text-sm tracking-tight">
                        {activity.type}
                      </span>
                      <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black rounded uppercase">
                        {activity.series}
                      </span>
                    </div>
                    <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black text-black mb-1">
                    +{activity.amount.toLocaleString()} <span className="text-[10px]">IDRX</span>
                  </p>
                  <div className="flex items-center justify-end gap-1 text-emerald-600">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-black uppercase">{activity.status}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-grass-subtext">
              <Clock size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase text-sm">No activities found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
