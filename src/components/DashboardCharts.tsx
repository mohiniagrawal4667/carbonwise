import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { EmissionsBreakdown } from '../types';
import { AVERAGE_MONTHLY_EMISSIONS } from '../utils/calculator';

interface DashboardChartsProps {
  breakdown: EmissionsBreakdown;
  targetCO2: number;
}

export default function DashboardCharts({ breakdown, targetCO2 }: DashboardChartsProps) {
  // Colors mapped to eco-logical emerald, blue, indigo, teal palette
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const categoryData = [
    { name: 'Transportation', value: breakdown.transport },
    { name: 'Household Energy', value: breakdown.electricity },
    { name: 'Food Habits', value: breakdown.food },
    { name: 'Sorting & Waste', value: breakdown.waste },
  ].filter(item => item.value > 0);

  const comparisonData = [
    {
      name: 'Status',
      'Your Footprint': breakdown.total,
      'Regional Average': AVERAGE_MONTHLY_EMISSIONS,
      'Sustainable Target': targetCO2,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100">{payload[0].name}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold">
            {payload[0].value.toFixed(1)} kg CO2e
          </p>
          {payload[0].payload.percent && (
            <p className="text-slate-400">
              {Math.round(payload[0].payload.percent * 100)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Category Breakdown (Donut Chart) */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="font-heading font-bold text-slate-800 dark:text-slate-200">
            Emissions by Category
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Visual breakdown of your carbon weight across primary transit, utility, and consumption items.
          </p>
        </div>

        <div className="h-64 relative flex items-center justify-center">
          {categoryData.length === 0 ? (
            <span className="text-sm text-slate-400">No category measurements</span>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          {categoryData.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
              />
              <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
              <span className="ml-auto font-bold text-slate-800 dark:text-slate-200">
                {Math.round((item.value / (breakdown.total || 1)) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparisons (Bar Chart) */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="font-heading font-bold text-slate-800 dark:text-slate-200">
            Comparison Matrix
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Your footprints stacked against national benchmarks and sustainable thresholds.
          </p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
              <Bar dataKey="Your Footprint" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Regional Average" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Sustainable Target" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center">
          Lower is better. Aligning the emerald pillar below blue is your primary environmental target!
        </p>
      </div>
    </div>
  );
}
