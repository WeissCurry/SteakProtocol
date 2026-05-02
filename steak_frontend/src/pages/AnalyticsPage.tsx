import { BarChart3, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const AnalyticsPage = () => {
  const metrics = [
    { label: 'Total TVL', value: '$12.4M', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Protocol Users', value: '1,240', icon: Users, color: 'text-blue-400' },
    { label: 'Insurance Fund', value: '$450K', icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Avg. ROI', value: '42.8%', icon: BarChart3, color: 'text-amber-400' },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2">Protocol Analytics</h1>
        <p className="text-zinc-400 max-w-2xl">
          Real-time data transparency for the Steak Protocol (Real World Animal Assets) ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
            <div
              className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 ${metric.color}`}
            >
              <metric.icon size={24} />
            </div>
            <p className="text-zinc-500 text-sm font-medium mb-1">{metric.label}</p>
            <h3 className="text-2xl font-bold">{metric.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 h-64 flex items-center justify-center">
        <p className="text-zinc-500 font-medium italic">TVL Growth Chart Placeholder</p>
      </div>
    </>
  );
};

export default AnalyticsPage;
