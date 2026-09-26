import React from 'react';
import { Goal } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AnalyticsChartsProps {
  goals: Goal[];
  currencySymbol?: string;
  isDark?: boolean;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  goals,
  currencySymbol = '₹',
  isDark = false,
}) => {
  // Goal distribution calculations
  const activeCount = goals.filter(g => g.status === 'Active' || g.status === 'Approaching Deadline').length;
  const completedCount = goals.filter(g => g.status === 'Completed').length;
  const overdueCount = goals.filter(g => g.status === 'Overdue').length;
  const totalCount = goals.length || 1;

  const activePct = Math.round((activeCount / totalCount) * 100);
  const completedPct = Math.round((completedCount / totalCount) * 100);
  const overduePct = Math.max(0, 100 - activePct - completedPct);

  // Monthly savings simulation data
  const monthlyData = [
    { month: 'Apr', amount: 20000, target: 15000 },
    { month: 'May', amount: 5000, target: 15000 },
    { month: 'Jun', amount: 20000, target: 18000 },
    { month: 'Jul', amount: 21500, target: 20000 },
    { month: 'Aug', amount: 33000, target: 25000 },
    { month: 'Sep', amount: 42500, target: 35000 },
  ];

  const maxAmount = Math.max(...monthlyData.map(d => d.amount));

  // Progress timeline data
  const timelinePoints = [
    { label: 'Apr 2026', total: 20000 },
    { label: 'May 2026', total: 25000 },
    { label: 'Jun 2026', total: 32000 },
    { label: 'Jul 2026', total: 36000 },
    { label: 'Aug 2026', total: 39500 },
    { label: 'Sep 2026', total: 42500 },
  ];

  const minVal = 15000;
  const maxVal = 50000;

  // SVG Line coordinates
  const svgWidth = 400;
  const svgHeight = 120;
  const paddingX = 20;
  const paddingY = 15;

  const points = timelinePoints.map((pt, i) => {
    const x = paddingX + (i / (timelinePoints.length - 1)) * (svgWidth - paddingX * 2);
    const normalizedY = (pt.total - minVal) / (maxVal - minVal);
    const y = svgHeight - paddingY - normalizedY * (svgHeight - paddingY * 2);
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Savings Progress Over Time */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Savings Progress
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Cumulative growth over past 6 months</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
            +8.4% MoM
          </span>
        </div>

        {/* SVG Graph */}
        <div className="relative pt-2">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-28 overflow-visible">
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Horizontal guidelines */}
            <line x1={paddingX} y1={svgHeight * 0.25} x2={svgWidth - paddingX} y2={svgHeight * 0.25} stroke={isDark ? '#334155' : '#f1f5f9'} strokeDasharray="3 3" />
            <line x1={paddingX} y1={svgHeight * 0.65} x2={svgWidth - paddingX} y2={svgHeight * 0.65} stroke={isDark ? '#334155' : '#f1f5f9'} strokeDasharray="3 3" />

            <path d={areaD} fill="url(#savingsGradient)" />
            <path d={pathD} fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#16A34A" strokeWidth="2" />
              </g>
            ))}
          </svg>

          {/* X Axis labels */}
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>
        </div>
      </div>

      {/* 2. Goal Distribution Donut */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="mb-4">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Goal Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Status breakdown across {goals.length} goals</p>
        </div>

        <div className="flex items-center justify-center gap-6 py-2">
          {/* Donut chart SVG */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={isDark ? '#334155' : '#f1f5f9'}
                strokeWidth="4.5"
              />
              {/* Active segment (Green) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#16A34A"
                strokeWidth="4.5"
                strokeDasharray={`${activePct * 0.88} 88`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Completed segment (Teal/Emerald dark) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#0D9488"
                strokeWidth="4.5"
                strokeDasharray={`${completedPct * 0.88} 88`}
                strokeDashoffset={`-${activePct * 0.88}`}
                strokeLinecap="round"
              />
              {/* Overdue segment (Red) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#EF4444"
                strokeWidth="4.5"
                strokeDasharray={`${overduePct * 0.88} 88`}
                strokeDashoffset={`-${(activePct + completedPct) * 0.88}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {goals.length}
              </span>
              <p className="text-[10px] text-slate-400">Total</p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Active ({activeCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Completed ({completedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Overdue ({overdueCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Monthly Savings Contributions Bar Chart */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Monthly Savings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Actual deposits vs projected targets</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 h-28 pt-4 pb-1">
          {monthlyData.map((item, idx) => {
            const heightPct = Math.round((item.amount / maxAmount) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="relative w-full flex items-end justify-center h-20">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[24px] rounded-t-md transition-all duration-300 group-hover:brightness-110 ${
                      idx === monthlyData.length - 1
                        ? 'bg-emerald-600'
                        : isDark
                        ? 'bg-slate-600 hover:bg-slate-500'
                        : 'bg-emerald-100 group-hover:bg-emerald-200'
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                    {formatCurrency(item.amount, currencySymbol)}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
