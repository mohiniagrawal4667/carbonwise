import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { 
  HistoryEntry, 
  UserProgress 
} from '../types';
import { 
  AVERAGE_MONTHLY_EMISSIONS, 
  calculateEcoScore 
} from '../utils/calculator';
import { 
  Flame, 
  Leaf, 
  TrendingDown, 
  Award,
  PlusCircle, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Target
} from 'lucide-react';

const LazyDashboardCharts = lazy(() => import('./DashboardCharts'));

interface DashboardProps {
  latestEmissions: HistoryEntry | null;
  progress: UserProgress;
  onNavigate: (tab: string) => void;
}

const ChartSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
    <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/40" />
    <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/40" />
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ latestEmissions, progress, onNavigate }) => {
  if (!latestEmissions) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6 px-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/40"
        >
          <Compass className="w-8 h-8" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white">
            No Carbon Metrics Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Please run your first carbon footprint calculations. CarbonWise will then render beautiful comparisons, breakdowns, and targets!
          </p>
        </div>

        <button
          onClick={() => onNavigate('calculator')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition duration-200 shadow-md shadow-emerald-600/10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch Calculator Wizard</span>
        </button>
      </div>
    );
  }

  const { breakdown, inputs } = latestEmissions;
  const ecoScore = calculateEcoScore(breakdown.total);
  const targetReductionPct = inputs.targetReduction ?? 20;

  // Sustainable footprint calculates as: (100 - reduction)% of previous status
  // Global reference target is AVERAGE_MONTHLY_EMISSIONS adjusted down
  const targetCO2 = parseFloat((AVERAGE_MONTHLY_EMISSIONS * (1 - targetReductionPct / 100)).toFixed(1));
  const userTargetCO2 = parseFloat((breakdown.total * (1 - targetReductionPct / 100)).toFixed(1));

  // Percentage difference user vs national averages
  const diffFromAveragePct = Math.round(
    ((breakdown.total - AVERAGE_MONTHLY_EMISSIONS) / AVERAGE_MONTHLY_EMISSIONS) * 100
  );

  const isBelowAverage = breakdown.total < AVERAGE_MONTHLY_EMISSIONS;
  const absoluteReductionDiff = Math.abs(diffFromAveragePct);

  // Challenge metrics
  const activeChallengesCompleted = progress.challenges.filter(ch => ch.isCompleted).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-4">
      {/* Upper Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Green Insights Center
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Live overview of your greenhouse footprint, daily sustainability progress, and habit history.
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Calculated using IPCC Grid Mapping Models</span>
        </div>
      </div>

      {/* Grid of Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Emissions */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Carbon Footprint</span>
            <Leaf className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              {breakdown.total.toFixed(1)} <span className="text-sm font-semibold text-slate-400">kg</span>
            </h3>
            <p className="text-xs font-medium leading-normal flex items-center gap-1">
              <span className={isBelowAverage ? 'text-emerald-500' : 'text-rose-500'}>
                {isBelowAverage ? '↓' : '↑'} {absoluteReductionDiff}%
              </span>
              <span className="text-slate-400">
                {isBelowAverage ? 'below' : 'above'} national average ({AVERAGE_MONTHLY_EMISSIONS} kg)
              </span>
            </p>
          </div>
        </div>

        {/* Target Progress Code */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Target Objective</span>
            <Target className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              {userTargetCO2.toFixed(1)} <span className="text-sm font-semibold text-slate-400">kg</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${Math.min(100, Math.max(10, (userTargetCO2 / (breakdown.total || 1)) * 100))}%` }} 
                />
              </div>
              <span className="text-xs text-slate-400 font-semibold shrink-0">
                {targetReductionPct}% lower
              </span>
            </div>
          </div>
        </div>

        {/* Eco Score Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Eco Score</span>
            <Award className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              {ecoScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </h3>
            <p className="text-xs font-medium text-slate-400">
              {ecoScore >= 90 ? '⭐⭐⭐⭐⭐ High Guardian' : ecoScore >= 70 ? '⭐⭐⭐⭐ Eco Active' : '⭐⭐ Eco Beginner'}
            </p>
          </div>
        </div>

        {/* Challenge Streaks Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Eco habit Streak</span>
            <Flame className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{progress.streak}</span>
              <span className="text-sm font-semibold text-slate-400">Days</span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>{progress.totalReductionSaved || 0} kg CO2 saved</span>
              <button 
                onClick={() => onNavigate('challenges')}
                className="text-emerald-500 hover:underline flex items-center gap-0.5"
              >
                Go <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Lazy Loaded Charts with Suspense */}
      <Suspense fallback={<ChartSkeleton />}>
        <LazyDashboardCharts breakdown={breakdown} targetCO2={targetCO2} />
      </Suspense>

      {/* Dynamic CTA to Action Center */}
      <section className="p-6 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-emerald-500/10">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-heading font-extrabold text-lg flex items-center justify-center md:justify-start gap-2">
            <TrendingDown className="w-5 h-5 animate-bounce" />
            <span>Ready to trim down your Footprint?</span>
          </h4>
          <p className="text-xs text-emerald-100/90 max-w-xl">
            We have generated personalized environmental advice targeting your custom habits. Explore your recommendations pane to start trimming CO2!
          </p>
        </div>
        <button
          onClick={() => onNavigate('recommendations')}
          className="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs uppercase tracking-wider shrink-0 transition shadow-sm cursor-pointer"
        >
          View Recommendations
        </button>
      </section>
    </div>
  );
};
