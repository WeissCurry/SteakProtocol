import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { MappedBatch } from '../../types/steak';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export const StatsRow = ({ batches = [] }: { batches?: MappedBatch[] }) => {
  const stats = useMemo(() => {
    const totalStaked = batches.reduce((acc, b) => acc + (b.totalStaked || 0), 0);
    const activeSeries = batches.filter((b) => b.isActive).length;
    const upcomingSeries = batches.filter((b) => !b.isActive && !b.isHarvested).length;

    const avgApy =
      batches.length > 0
        ? (batches.reduce((acc, b) => acc + parseFloat(b.apy), 0) / batches.length).toFixed(2)
        : '0.00';

    return [
      {
        label: 'Total Value Staked',
        value: `${totalStaked.toLocaleString('en-US')} IDRX`,
        change: `Across ${batches.length} batches`,
        color: 'text-emerald-500',
      },
      {
        label: 'Active Series',
        value: activeSeries.toString(),
        change: `${upcomingSeries} upcoming`,
        color: 'text-amber-500',
      },
      {
        label: 'Fixed Rate (Avg)',
        value: `${avgApy}%`,
        change: 'P.A',
        color: 'text-emerald-500',
      },
    ];
  }, [batches]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border-2 border-black p-6 rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <div className="relative z-10">
            <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-1 bg-grass-primary w-fit px-2 border-2 border-black">
              {stat.label}
            </p>
            <div className="flex items-end justify-between mt-4">
              <h3 className="text-xl font-black text-black">{stat.value}</h3>
              <span
                className={`text-[9px] font-black px-3 py-1 rounded-full border-2 border-black bg-white ${stat.color}`}
              >
                {stat.change}
              </span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-grass-primary/10 rounded-full blur-2xl group-hover:bg-grass-primary/20 transition-colors" />
        </div>
      ))}
    </div>
  );
};

export const PerformanceCard = ({ batches = [] }: { batches?: MappedBatch[] }) => {
  const chartData = useMemo(() => {
    // Take last 6 batches and sort by ID ascending for the chart timeline
    const history = [...batches].sort((a, b) => (a.batchId || 0) - (b.batchId || 0)).slice(-6);

    const labels =
      history.length > 0
        ? history.map((b) => b.name || `SS${String(b.batchId).padStart(3, '0')}`)
        : ['S0', 'S1', 'S2', 'S3', 'S4', 'S5'];

    const data =
      history.length > 0 ? history.map((b) => parseFloat(b.apy)) : [4.5, 5.2, 4.8, 6.1, 5.8, 6.4];

    return {
      labels,
      datasets: [
        {
          data,
          borderColor: '#000000',
          backgroundColor: 'rgba(181, 255, 0, 0.4)',
          borderWidth: 4,
          tension: 0.2, // Smoother line
          fill: true,
          pointBackgroundColor: '#000000',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          hoverRadius: 8,
        },
      ],
    };
  }, [batches]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000000',
        titleFont: { weight: 'bold' },
        cornerRadius: 0,
        displayColors: false,
        callbacks: {
          label: (context) => `Yield: ${context.parsed.y}% P.A`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          font: { weight: 'bold', size: 8 },
          color: '#000000',
        },
      },
      y: {
        display: true,
        grid: { display: true, color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { weight: 'bold', size: 8 },
          color: '#000000',
          callback: (val) => `${val}%`,
        },
      },
    },
  };

  const latestBatches = useMemo(() => {
    return [...batches].sort((a, b) => (b.batchId || 0) - (a.batchId || 0)).slice(0, 2);
  }, [batches]);

  return (
    <div className="bg-white border-2 border-black p-8 rounded-[32px] mb-10 overflow-hidden relative group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-grass-primary border-2 border-black text-black text-[10px] font-black rounded-full uppercase tracking-widest">
              FIXED RATE RWA
            </span>
            <span className="text-grass-subtext text-[10px] font-black uppercase tracking-widest">
              Performance Index
            </span>
          </div>
          <h2 className="text-3xl font-black mb-6 text-black uppercase tracking-tighter italic">
            Yield Performance
          </h2>
          <p className="text-grass-subtext font-black text-[11px] mb-8 leading-relaxed max-w-xl uppercase tracking-widest">
            Yields are calculated daily based on the valuation growth of livestock assets in
            Indonesia. Secure, Ethical, & Transparent. 🐐🌿
          </p>
          <div className="flex flex-wrap gap-6">
            {latestBatches.length > 0 ? (
              latestBatches.map((batch, idx) => (
                <div
                  key={batch.batchId}
                  className={`border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[160px] ${
                    idx === 0 ? 'bg-grass-primary' : 'bg-white'
                  }`}
                >
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest mb-1 ${idx === 0 ? 'text-black' : 'text-grass-subtext'}`}
                  >
                    {batch.name || `Series SS${String(batch.batchId).padStart(3, '0')}`}
                  </p>
                  <p className="text-2xl font-black text-black italic">
                    {batch.apy}{' '}
                    <span className="text-[10px] not-italic opacity-60 font-black">P.A</span>
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-1">
                    Series SS001
                  </p>
                  <p className="text-2xl font-black text-black">
                    6.15% <span className="text-xs text-grass-subtext font-black">p.a</span>
                  </p>
                </div>
                <div className="bg-grass-primary border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black text-[10px] font-black uppercase tracking-widest mb-1">
                    Series SS002
                  </p>
                  <p className="text-2xl font-black text-black">
                    6.40% <span className="text-xs text-black/60 font-black">p.a</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full md:w-80 h-48 bg-white border-2 border-black rounded-[24px] p-4 flex items-center justify-center">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

interface SukukCardProps {
  id: string;
  name: string;
  duration: number;
  roi: string;
  quota: number;
  maxQuota: number;
  isProcessing?: boolean;
  isActive?: boolean;
  isHarvested?: boolean;
  goats?: number;
  cows?: number;
  onStake?: (amount: number) => void;
}

export const SukukCard: React.FC<SukukCardProps> = ({
  name,
  duration,
  roi,
  quota,
  maxQuota,
  isProcessing,
  isActive,
  isHarvested,
  goats = 0,
  cows = 0,
  onStake,
}) => {
  const [stakeAmount, setStakeAmount] = useState<string>('1000000');
  const percentage = Math.min(100, (quota / maxQuota) * 100);
  const badgeColors: Record<number, string> = {
    30: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    60: 'bg-grass-primary/10 text-grass-dark border-grass-primary/20',
    90: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  const isClosed = isActive || isHarvested || percentage >= 100;

  return (
    <div className="group bg-white border-2 border-black p-8 rounded-[32px] transition-all duration-200 flex flex-col gap-8 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <span
            className={`text-[9px] uppercase font-black px-3 py-1.5 rounded-full border-2 border-black ${badgeColors[duration] || badgeColors[30]}`}
          >
            {duration} DAY LOCK
          </span>
          <h4 className="text-xl font-black mt-4 text-black uppercase tracking-tighter">{name}</h4>
        </div>
        <div className="text-right">
          <p className="text-grass-subtext text-[9px] font-black uppercase tracking-widest">
            Yield
          </p>
          <div className="bg-grass-primary border-2 border-black px-3 py-1 mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg font-black text-black">{roi}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 p-3 bg-zinc-50 border-2 border-black rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-lg">🐐</span>
          <div>
            <p className="text-[8px] font-black uppercase text-grass-subtext leading-none">Goats</p>
            <p className="text-xs font-black text-black">{goats}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-l-2 border-black/10 pl-3">
          <span className="text-lg">🐄</span>
          <div>
            <p className="text-[8px] font-black uppercase text-grass-subtext leading-none">Cows</p>
            <p className="text-xs font-black text-black">{cows}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-grass-subtext italic">Filled</span>
            <span className="text-black">
              {quota.toLocaleString('en-US')} / {maxQuota.toLocaleString('en-US')}
            </span>
          </div>
          <div className="h-5 w-full bg-white border-2 border-black rounded-full overflow-hidden p-[2px] shadow-inner">
            <div
              className={`h-full border-r-2 border-black transition-all duration-1000 ${
                isHarvested ? 'bg-zinc-400' : 'bg-grass-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[9px] text-grass-subtext font-black uppercase">
              {percentage.toFixed(1)}%
            </p>
            <span
              className={`text-[9px] font-black px-2 uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                isHarvested
                  ? 'bg-zinc-200 text-zinc-500'
                  : isActive
                    ? 'bg-amber-400 text-black'
                    : 'bg-black text-white'
              }`}
            >
              {isHarvested ? 'Closed' : isActive ? 'Live' : 'Upcoming'}
            </span>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            disabled={isClosed}
            value={stakeAmount ? Number(stakeAmount).toLocaleString('en-US') : ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setStakeAmount(val);
            }}
            className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-black focus:outline-none focus:bg-grass-primary/5 transition-all text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:bg-zinc-100 disabled:cursor-not-allowed"
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black font-black text-xs opacity-40">
            IDRX
          </div>
        </div>
      </div>

      <button
        disabled={isProcessing || isClosed || !stakeAmount}
        onClick={() => onStake?.(Number(stakeAmount.replace(/\./g, '')))}
        className={`w-full py-4 rounded-xl font-black transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-3 text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
          isClosed
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none translate-y-0'
            : 'bg-grass-primary text-black hover:bg-emerald-400'
        }`}
      >
        {isProcessing ? (
          <RefreshCw size={20} className="animate-spin" />
        ) : isHarvested ? (
          'SETTLED'
        ) : isActive ? (
          'LIVE'
        ) : percentage >= 100 ? (
          'FULL'
        ) : (
          'STAKE NOW'
        )}
      </button>

      <div className="pt-3 border-t-2 border-black flex items-center gap-2 text-[8px] text-grass-subtext font-black uppercase tracking-widest">
        <div
          className={`w-2 h-2 rounded-full border border-black ${
            isHarvested
              ? 'bg-zinc-400'
              : isActive
                ? 'bg-amber-400 animate-pulse'
                : 'bg-black animate-pulse'
          }`}
        />
        Base Asset: Livestock 🐐
      </div>
    </div>
  );
};
